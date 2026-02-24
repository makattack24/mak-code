import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../themetoggle/themetoggle.component';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
	private auth = inject(AuthService);

	mobileMenuOpen = false;
	@Input() terminalVisible = true;
	@Output() toggleTerminal = new EventEmitter<void>();

	navLinks = [
		{ path: '/home', label: 'Home', icon: 'fa-solid fa-house' },
		{ path: '/about', label: 'About', icon: 'fa-solid fa-user' },
		{ path: '/apps', label: 'Apps', icon: 'fa-solid fa-grip' },
		{ path: '/contact', label: 'Contact', icon: 'fa-solid fa-envelope' },
		{ path: '/LeetCode', label: 'LeetCode', icon: 'fa-solid fa-dumbbell' },
		{ path: '/data-display', label: 'Data Display', icon: 'fa-solid fa-table' }
	];

	isLoggedIn$ = this.auth.isLoggedIn$;
	isAdmin$ = this.auth.isAdmin$;
	currentUser$ = this.auth.currentUser$;

	toggleMenu(): void {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}

	closeMenu(): void {
		this.mobileMenuOpen = false;
	}

	logout(): void {
		this.auth.logout();
		this.closeMenu();
	}

	getInitials(name?: string | null): string {
		if (!name) return '?';
		return name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	@HostListener('document:keydown.escape')
	onEscape(): void {
		this.closeMenu();
	}
}
