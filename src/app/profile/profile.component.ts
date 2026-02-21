import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from '../services/auth.service';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
	private auth = inject(AuthService);
	private router = inject(Router);

	user: AuthUser | null = null;

	// Form fields
	name = '';
	email = '';
	avatarUrl = '';
	currentPassword = '';
	newPassword = '';
	confirmPassword = '';

	// UI state
	showPasswordSection = false;
	showCurrentPassword = false;
	showNewPassword = false;
	saving = false;
	savingPassword = false;
	savingAvatar = false;
	successMessage = '';
	errorMessage = '';
	passwordSuccess = '';
	passwordError = '';
	avatarSuccess = '';
	avatarError = '';

	// Avatar preview
	avatarPreview: string | null = null;

	ngOnInit() {
		this.user = this.auth.currentUser;
		if (!this.user) {
			this.router.navigate(['/login']);
			return;
		}
		this.name = this.user.name || '';
		this.email = this.user.email;
		this.avatarUrl = this.user.avatar_url || '';
		this.avatarPreview = this.avatarUrl || null;

		// Refresh from server
		this.auth.refreshProfile().subscribe((u) => {
			if (u) {
				this.user = u;
				this.name = u.name || '';
				this.email = u.email;
				this.avatarUrl = u.avatar_url || '';
				this.avatarPreview = this.avatarUrl || null;
			}
		});
	}

	get initials(): string {
		if (!this.name) return '?';
		return this.name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	get passwordsMatch(): boolean {
		return this.newPassword === this.confirmPassword;
	}

	get passwordLongEnough(): boolean {
		return this.newPassword.length >= 6;
	}

	// ── Avatar via URL ──
	onAvatarUrlChange() {
		this.avatarPreview = this.avatarUrl || null;
	}

	// ── Avatar via file upload (converts to base64 data URI) ──
	onAvatarFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Limit to 200KB for DB storage
		if (file.size > 200 * 1024) {
			this.avatarError = 'Image must be under 200KB.';
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result as string;
			this.avatarPreview = dataUrl;
			this.avatarUrl = dataUrl;
			this.avatarError = '';
		};
		reader.readAsDataURL(file);
	}

	removeAvatar() {
		this.avatarUrl = '';
		this.avatarPreview = null;
	}

	// ── Save profile info (name + email) ──
	saveProfile() {
		this.clearMessages();
		this.saving = true;

		this.auth
			.updateProfile({ name: this.name, email: this.email })
			.subscribe((result) => {
				this.saving = false;
				if (result.user) {
					this.user = result.user;
					this.successMessage = 'Profile updated successfully.';
				} else {
					this.errorMessage = result.error || 'Update failed.';
				}
			});
	}

	// ── Save avatar ──
	saveAvatar() {
		this.avatarSuccess = '';
		this.avatarError = '';
		this.savingAvatar = true;

		this.auth.updateProfile({ avatar_url: this.avatarUrl }).subscribe((result) => {
			this.savingAvatar = false;
			if (result.user) {
				this.user = result.user;
				this.avatarSuccess = 'Avatar updated.';
			} else {
				this.avatarError = result.error || 'Failed to update avatar.';
			}
		});
	}

	// ── Change password ──
	changePassword() {
		this.passwordSuccess = '';
		this.passwordError = '';

		if (!this.passwordsMatch) {
			this.passwordError = 'Passwords do not match.';
			return;
		}
		if (!this.passwordLongEnough) {
			this.passwordError = 'New password must be at least 6 characters.';
			return;
		}

		this.savingPassword = true;

		this.auth
			.updateProfile({
				currentPassword: this.currentPassword,
				newPassword: this.newPassword,
			})
			.subscribe((result) => {
				this.savingPassword = false;
				if (result.user) {
					this.passwordSuccess = 'Password changed successfully.';
					this.currentPassword = '';
					this.newPassword = '';
					this.confirmPassword = '';
					this.showPasswordSection = false;
				} else {
					this.passwordError = result.error || 'Failed to change password.';
				}
			});
	}

	logout(): void {
		this.auth.logout();
		this.router.navigate(['/home']);
	}

	private clearMessages() {
		this.successMessage = '';
		this.errorMessage = '';
	}
}
