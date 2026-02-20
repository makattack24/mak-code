import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthUser {
	id: number;
	email: string;
	role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly STORAGE_KEY = 'auth_user';
	private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());

	/** Observable of the currently logged-in user (or null). */
	currentUser$ = this.currentUserSubject.asObservable();

	/** Emits true when a user is logged in. */
	isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map((u) => !!u));

	/** Emits true when the logged-in user has the admin role. */
	isAdmin$: Observable<boolean> = this.currentUser$.pipe(
		map((u) => u?.role === 'admin')
	);

	constructor(private http: HttpClient, private router: Router) {}

	/** Authenticate against the backend and persist the session. */
	login(email: string, password: string): Observable<AuthUser | null> {
		return this.http
			.post<AuthUser>('/.netlify/functions/login', { email, password })
			.pipe(
				tap((user) => {
					this.saveUser(user);
					this.currentUserSubject.next(user);
				}),
				catchError((err) => {
					console.error('Login failed:', err);
					return of(null);
				})
			);
	}

	/** Clear local session and redirect to home. */
	logout(): void {
		localStorage.removeItem(this.STORAGE_KEY);
		this.currentUserSubject.next(null);
		this.router.navigate(['/home']);
	}

	/** Snapshot of the current user (non-observable). */
	get currentUser(): AuthUser | null {
		return this.currentUserSubject.value;
	}

	// ── private helpers ──────────────────────────────────

	private saveUser(user: AuthUser): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
	}

	private loadUser(): AuthUser | null {
		try {
			const raw = localStorage.getItem(this.STORAGE_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}
}
