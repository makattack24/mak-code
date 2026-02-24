import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface TerminalLine {
	type: 'command' | 'output';
	text: string;
}

@Injectable({ providedIn: 'root' })
export class TerminalCommandsService {
	constructor(private router: Router) {}

	getHandlers(
		lines: TerminalLine[],
		navigationHistory: string[]
	): { [key: string]: () => void } {
		const goAbout = () => {
			lines.push({ type: 'output', text: 'Navigating to about page.' });
			this.router.navigate(['/about']);
		};
		const goContact = () => {
			lines.push({ type: 'output', text: 'Navigating to contact page.' });
			this.router.navigate(['/contact']);
		};
		const goApps = () => {
			lines.push({ type: 'output', text: 'Navigating to apps page.' });
			this.router.navigate(['/apps']);
		};
		const goHome = () => {
			lines.push({ type: 'output', text: 'Navigating to home page.' });
			this.router.navigate(['/home']);
		};
		const goAdmin = () => {
			lines.push({ type: 'output', text: 'Navigating to admin page.' });
			this.router.navigate(['/admin']);
		};
		const goLogin = () => {
			lines.push({ type: 'output', text: 'Navigating to login page.' });
			this.router.navigate(['/login']);
		};
		const goSignup = () => {
			lines.push({ type: 'output', text: 'Navigating to sign up page.' });
			this.router.navigate(['/signup']);
		};
		const goStats = () => {
			lines.push({ type: 'output', text: 'Navigating to stats page.' });
			this.router.navigate(['/stats']);
		};
		const goPractice = () => {
			lines.push({ type: 'output', text: 'Navigating to leetcode page.' });
			this.router.navigate(['/leetcode']);
		};
		const goProfile = () => {
			lines.push({ type: 'output', text: 'Navigating to profile page.' });
			this.router.navigate(['/profile']);
		};
		const goDataDisplay = () => {
			lines.push({ type: 'output', text: 'Navigating to data display page.' });
			this.router.navigate(['/data-display']);
		};

		return {
			about: goAbout,
			'/about': goAbout,
			contact: goContact,
			'/contact': goContact,
			apps: goApps,
			'/apps': goApps,
			home: goHome,
			'/home': goHome,
			admin: goAdmin,
			'/admin': goAdmin,
			login: goLogin,
			'/login': goLogin,
			signup: goSignup,
			'/signup': goSignup,
			stats: goStats,
			'/stats': goStats,
			practice: goPractice,
			'/leetcode': goPractice,
			profile: goProfile,
			'/profile': goProfile,
			dataDisplay: goDataDisplay,
			'data-display': goDataDisplay,
			'/data-display': goDataDisplay,
			help: () => {
				lines.push({
					type: 'output',
					text: 'Available commands: /about, /contact, /apps, /home, /admin, /leetcode, /profile, /data-display, back',
				});
			},
			back: () => {
				if (navigationHistory.length > 1) {
					// Remove current URL
					navigationHistory.pop();
					// Get previous URL
					const previousUrl =
						navigationHistory[navigationHistory.length - 1];
					if (previousUrl) {
						lines.push({
							type: 'output',
							text: `Navigating to previous page: ${previousUrl}`,
						});
						this.router.navigateByUrl(previousUrl);
					} else {
						lines.push({
							type: 'output',
							text: 'No previous page in history.',
						});
					}
				} else {
					lines.push({
						type: 'output',
						text: 'No previous page in history.',
					});
				}
			},
			cls: () => {
				lines.length = 0;
			},
			clear: () => {
				lines.length = 0;
			},
			ls: () => {
				lines.push({
					type: 'output',
					text: 'Available directories: /home, /about, /contact, /apps, /leetcode, /data-display',
				});
			},
			kill: () => {
				const match = this.router.url.match(/^\/apps\/[^\/]+$/);
				if (match) {
					this.router.navigate(['/apps']);
					lines.push({
						type: 'output',
						text: 'Closing the application.',
					});
				} else {
					lines.push({
						type: 'output',
						text: 'No app is currently running.',
					});
				}
			},
			'/': () => {
				lines.push({
					type: 'output',
					text: 'Navigating to home page.',
				});
				this.router.navigate(['/home']);
			},
		};
	}
}
