import { Routes } from '@angular/router';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
	{ path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
	{ path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
	{ path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
	{ path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
	{ path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
	{ path: 'leetcode', loadComponent: () => import('./coding_practice/practice.component').then(m => m.PracticeComponent) },
	{ path: 'data-display', loadComponent: () => import('./data_display/data_display.component').then(m => m.DataDisplayComponent) },
	{
		path: 'apps',
		loadComponent: () => import('./apps/apps.component').then(m => m.AppsComponent),
		children: [
			{ path: 'calculator', loadComponent: () => import('./apps/calculator/calculator.component').then(m => m.CalculatorComponent) },
			{ path: 'clock', loadComponent: () => import('./apps/clock/clock.component').then(m => m.ClockComponent) },
			{ path: 'game', loadComponent: () => import('./apps/game/game.component').then(m => m.GameComponent) },
			{ path: 'sim', loadComponent: () => import('./apps/graphicsgame/graphicsgame.component').then(m => m.GraphicsgameComponent) },
			{ path: 'sound', loadComponent: () => import('./apps/sound/sound.component').then(m => m.SoundComponent) },
			{ path: 'editor', loadComponent: () => import('./apps/editor/editor.component').then(m => m.EditorComponent) },
		],
	},
	{ path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
	{ path: '**', redirectTo: '' },
];
