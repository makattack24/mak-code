import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that allows access only to authenticated admin users.
 * Redirects to /login if the user is not logged in or not an admin.
 */
export const adminGuard: CanActivateFn = () => {
	const auth = inject(AuthService);
	const router = inject(Router);

	const user = auth.currentUser;

	if (user && user.role === 'admin') {
		return true;
	}

	return router.createUrlTree(['/login']);
};
