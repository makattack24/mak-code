import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface AuthUser {
	id: number;
	name: string;
	email: string;
	role: string;
	avatar_url?: string;
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

	constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

	/** Authenticate against the backend and persist the session. */
	login(email: string, password: string): Observable<AuthUser | null> {
		return this.http
			.post<AuthUser>('/.netlify/functions/login', { email, password })
			.pipe(
				tap((user) => {
					this.saveUser(user);
					this.currentUserSubject.next(user);
					this.toastr.success(`Welcome back, ${user.name}!`, 'Logged In');
				}),
				catchError((err) => {
					console.error('Login failed:', err);
					this.toastr.error('Invalid email or password.', 'Login Failed');
					return of(null);
				})
			);
	}

	/** Register a new account and log in on success. */
	signup(name: string, email: string, password: string): Observable<{ user?: AuthUser; error?: string }> {
		return this.http
			.post<AuthUser>('/.netlify/functions/signup', { name, email, password })
			.pipe(
				tap((user) => {
					this.saveUser(user);
					this.currentUserSubject.next(user);
				}),
				map((user) => ({ user })),
				catchError((err) => {
					const msg = err?.error?.error || 'Signup failed. Please try again.';
					return of({ error: msg });
				})
			);
	}

	/** Clear local session and redirect to home. */
	logout(): void {
		localStorage.removeItem(this.STORAGE_KEY);
		this.currentUserSubject.next(null);
		this.toastr.info('You have been logged out.', 'Logged Out');
		this.router.navigate(['/home']);
	}

	/** Fetch the latest profile from the server and update local state. */
	refreshProfile(): Observable<AuthUser | null> {
		const user = this.currentUser;
		if (!user) return of(null);
		return this.http.get<AuthUser>(`/.netlify/functions/profile?id=${user.id}`).pipe(
			tap((u) => {
				this.saveUser(u);
				this.currentUserSubject.next(u);
			}),
			catchError(() => of(null))
		);
	}

	/** Update user profile fields. */
	updateProfile(data: {
		name?: string;
		email?: string;
		currentPassword?: string;
		newPassword?: string;
		avatar_url?: string;
	}): Observable<{ user?: AuthUser; error?: string }> {
		const user = this.currentUser;
		if (!user) return of({ error: 'Not logged in.' });
		return this.http
			.put<AuthUser>('/.netlify/functions/profile', { id: user.id, ...data })
			.pipe(
				tap((u) => {
					this.saveUser(u);
					this.currentUserSubject.next(u);
				}),
				map((u) => ({ user: u })),
				catchError((err) => {
					const msg = err?.error?.error || 'Profile update failed.';
					return of({ error: msg });
				})
			);
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
