import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	email = '';
	password = '';
	errorMessage = '';
	loading = false;

	constructor(
		private auth: AuthService,
		private router: Router
	) {}

	onSubmit(): void {
		this.errorMessage = '';
		this.loading = true;

		this.auth.login(this.email, this.password).subscribe((user) => {
			this.loading = false;
			if (user) {
				this.router.navigate(['/home']);
			} else {
				this.errorMessage = 'Invalid email or password.';
			}
		});
	}
}
