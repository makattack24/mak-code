import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
})
export class SignupComponent {
	name = '';
	email = '';
	password = '';
	confirmPassword = '';
	errorMessage = '';
	successMessage = '';
	loading = false;
	showPassword = false;

	constructor(
		private auth: AuthService,
		private router: Router
	) {}

	get passwordsMatch(): boolean {
		return this.password === this.confirmPassword;
	}

	get passwordLongEnough(): boolean {
		return this.password.length >= 6;
	}

	togglePassword() {
		this.showPassword = !this.showPassword;
	}

	onSubmit(): void {
		this.errorMessage = '';
		this.successMessage = '';

		if (!this.passwordsMatch) {
			this.errorMessage = 'Passwords do not match.';
			return;
		}

		if (!this.passwordLongEnough) {
			this.errorMessage = 'Password must be at least 6 characters.';
			return;
		}

		this.loading = true;

		this.auth.signup(this.name, this.email, this.password).subscribe((result) => {
			this.loading = false;
			if (result.user) {
				this.successMessage = 'Account created! Redirecting...';
				setTimeout(() => this.router.navigate(['/home']), 1200);
			} else {
				this.errorMessage = result.error || 'Signup failed.';
			}
		});
	}
}
