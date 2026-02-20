import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../themetoggle/themetoggle.component';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
	mobileMenuOpen = false;
	@Input() terminalVisible = true;
	@Output() toggleTerminal = new EventEmitter<void>();

	navLinks = [
		{ path: '/home', label: 'Home', icon: 'fa-solid fa-house' },
		{ path: '/about', label: 'About', icon: 'fa-solid fa-user' },
		{ path: '/apps', label: 'Apps', icon: 'fa-solid fa-grip' },
		{ path: '/contact', label: 'Contact', icon: 'fa-solid fa-envelope' },
	];

	toggleMenu(): void {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}

	closeMenu(): void {
		this.mobileMenuOpen = false;
	}

	@HostListener('document:keydown.escape')
	onEscape(): void {
		this.closeMenu();
	}
}
