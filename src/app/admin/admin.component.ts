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
    filteredUsers: User[] = [];
    loading = true;
    error: string | null = null;
    
    // Search property
    searchTerm = '';
    
    // Form properties
    showAddForm = false;
    addingUser = false;
    newUser: NewUser = {
        name: '',
        email: '',
        role: 'user'
    };

    // Pagination properties
    currentPage = 1;
    itemsPerPage = 10;
    itemsPerPageOptions = [10, 20, 30];
    totalPages = 0;

    private apiUrl = '/.netlify/functions/users';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    get paginatedUsers(): User[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredUsers.slice(startIndex, endIndex);
    }

    get totalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    get startIndex(): number {
        if (this.filteredUsers.length === 0) return 0;
        return (this.currentPage - 1) * this.itemsPerPage + 1;
    }

    get endIndex(): number {
        const end = this.currentPage * this.itemsPerPage;
        return Math.min(end, this.filteredUsers.length);
    }

    onSearch(): void {
        this.filterUsers();
        this.currentPage = 1;
        this.updatePagination();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.filterUsers();
        this.currentPage = 1;
        this.updatePagination();
    }

    private filterUsers(): void {
        if (!this.searchTerm.trim()) {
            this.filteredUsers = [...this.users];
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredUsers = this.users.filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.role.toLowerCase().includes(searchLower) ||
                user.id.toString().includes(searchLower)
            );
        }
    }

    updatePagination(): void {
        this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
    }

    onItemsPerPageChange(): void {
        this.currentPage = 1;
        this.updatePagination();
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    loadUsers(): void {
        this.loading = true;
        this.error = null;
        this.http.get<User[]>(this.apiUrl).subscribe({
            next: (data) => {
                this.users = data;
                this.filterUsers();
                this.loading = false;
                this.updatePagination();
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
                this.filterUsers();
                this.updatePagination();
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
                this.filterUsers();
                this.updatePagination();
            },
            error: (err) => {
                console.error(err);
                this.error = 'Failed to delete user';
            }
        });
    }
}