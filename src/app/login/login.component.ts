import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    email = '';
    password = '';
    error = '';
    loading = false;

    constructor(private http: HttpClient) { }

    async login() {
        this.loading = true;
        this.error = '';
        try {
            const result = await firstValueFrom(
                this.http.post<any>('/.netlify/functions/login', {
                    email: this.email,
                    password: this.password
                })
            );
            // Redirect based on role
            console.log(result);
            if (result.role === 'admin') {
                window.location.href = '/admin';
            } else {
                alert('Login successful!');
                // Optionally redirect to home or another page
            }
        } catch (err: any) {
            this.error = err.error || 'Login failed';
        } finally {
            this.loading = false;
        }
    }
}