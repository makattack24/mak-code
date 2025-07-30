import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

@Component({
	selector: 'app-admin',
	standalone: true,
	imports: [CommonModule, HttpClientModule],
	template: `
		<div class="admin-container">
			<h2>Users</h2>

			<div *ngIf="loading">Loading users...</div>
			<div *ngIf="error">{{ error }}</div>

			<table *ngIf="!loading && users.length > 0" class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
					</tr>
				</thead>
				<tbody>
					<tr *ngFor="let user of users">
						<td>{{ user.id }}</td>
						<td>{{ user.name }}</td>
						<td>{{ user.email }}</td>
						<td>{{ user.role }}</td>
					</tr>
				</tbody>
			</table>

			<div *ngIf="!loading && users.length === 0">
				No users found.
			</div>
		</div>
	`,
	styles: [`
		.admin-container {
			padding: 1rem;
			max-width: 800px;
			margin: auto;
		}
		table {
			width: 100%;
			border-collapse: collapse;
		}
		th, td {
			border: 1px solid #ccc;
			padding: 0.5rem;
			text-align: left;
		}
	`]
})
export class AdminComponent implements OnInit {
	users: User[] = [];
	loading = true;
	error: string | null = null;

	constructor(private http: HttpClient) { }

	ngOnInit(): void {
		this.http.get<User[]>('/.netlify/functions/users').subscribe({
			next: (data) => {
				this.users = data;
				this.loading = false;
			},
			error: (err) => {
				console.error(err);
				this.error = 'Failed to load users';
				this.loading = false;
			}
		});
	}
}
