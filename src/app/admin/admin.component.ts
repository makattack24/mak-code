import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../shared/modal/modal.component';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isactive: boolean;
}

interface NewUser {
    name: string;
    email: string;
    role: string;
    isactive?: boolean;
}

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule, ModalComponent],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    loading = true;
    error: string | null = null;
    editUser: User | null = null;
    editUserForm: NewUser = { name: '', email: '', role: 'user', isactive: true };
    updatingUser = false;
    // Search property
    searchTerm = '';
    sortColumn: (keyof User) | '' = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    // Form properties
    showAddForm = false;
    addingUser = false;
    newUser: NewUser = {
        name: '',
        email: '',
        role: 'user',
        isactive: true
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

    sortBy(column: keyof User) {
        if (this.sortColumn === column) {
            // Toggle direction
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sortUsers();
    }

    sortUsers() {
        if (!this.sortColumn) return;
        const dir = this.sortDirection === 'asc' ? 1 : -1;
        // Type guard to ensure sortColumn is keyof User
        if (this.sortColumn) {
            this.filteredUsers.sort((a, b) => {
                const valA = a[this.sortColumn as keyof User];
                const valB = b[this.sortColumn as keyof User];
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return valA.localeCompare(valB) * dir;
                }
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * dir;
                }
                if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                    return (Number(valA) - Number(valB)) * dir;
                }
                return 0;
            });
        }
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
        this.sortUsers();
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


    cancelEdit(): void {
        this.editUser = null;
        this.updatingUser = false;
    }


    startEditUser(user: User): void {
        this.editUser = { ...user };
        this.editUserForm = {
            name: user.name,
            email: user.email,
            role: user.role,
            isactive: user.isactive
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

    updateUser(): void {
        if (!this.editUser) return;
        this.updatingUser = true;
        const updatedUser = {
            ...this.editUser,
            ...this.editUserForm
        };
        this.http.put<User>(`${this.apiUrl}?id=${this.editUser.id}`, updatedUser).subscribe({
            next: (user) => {
                // Update the user in the local array
                const idx = this.users.findIndex(u => u.id === user.id);
                if (idx !== -1) this.users[idx] = user;
                this.filterUsers();
                this.updatePagination();
                this.editUser = null;
                this.updatingUser = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Failed to update user';
                this.updatingUser = false;
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