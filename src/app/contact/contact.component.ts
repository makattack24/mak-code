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
	error = '';

	onSubmit() {
		this.error = '';
		if (!this.name || !this.email || !this.message) {
			this.error = 'Please fill in all fields.';
			return;
		}
		// Simulate sending (replace with real API call)
		this.submitted = true;
	}
}
