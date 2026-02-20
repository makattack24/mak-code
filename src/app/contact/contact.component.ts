import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-contact',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './contact.component.html',
	styleUrl: './contact.component.scss',
})
export class ContactComponent {
	name = '';
	email = '';
	message = '';
	submitted = false;
	submitting = false;
	error = '';

	async onSubmit() {
		this.error = '';
		if (!this.name || !this.email || !this.message) {
			this.error = 'Please fill in all fields.';
			return;
		}

		this.submitting = true;
		try {
			const response = await fetch('/.netlify/functions/contacts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: this.name,
					email: this.email,
					message: this.message,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}

			this.submitted = true;
		} catch (err) {
			this.error = 'Something went wrong. Please try again.';
		} finally {
			this.submitting = false;
		}
	}
}
