import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface NewUser {
    name: string;
    email: string;
    role: string;
}

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    users: User[] = [];
    loading = true;
    error: string | null = null;
    
    // Form properties
    showAddForm = false;
    addingUser = false;
    newUser: NewUser = {
        name: '',
        email: '',
        role: 'user'
    };

    private apiUrl = '/.netlify/functions/users';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.error = null;
        this.http.get<User[]>(this.apiUrl).subscribe({
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

    toggleAddForm(): void {
        this.showAddForm = !this.showAddForm;
        if (!this.showAddForm) {
            this.resetForm();
        }
    }

    resetForm(): void {
        this.newUser = {
            name: '',
            email: '',
            role: 'user'
        };
    }

    addUser(): void {
        if (!this.newUser.name || !this.newUser.email) {
            return;
        }

        this.addingUser = true;
        this.http.post<User>(this.apiUrl, this.newUser).subscribe({
            next: (user) => {
                this.users.push(user);
                this.addingUser = false;
                this.showAddForm = false;
                this.resetForm();
            },
            error: (err) => {
                console.error(err);
                this.error = 'Failed to add user';
                this.addingUser = false;
            }
        });
    }

    deleteUser(userId: number): void {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        this.http.delete(`${this.apiUrl}?id=${userId}`).subscribe({
            next: () => {
                this.users = this.users.filter(user => user.id !== userId);
            },
            error: (err) => {
                console.error(err);
                this.error = 'Failed to delete user';
            }
        });
    }
}