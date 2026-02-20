import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface AppItem {
	name: string;
	icon: string;
	route: string;
	description: string;
}

@Component({
	selector: 'app-apps',
	imports: [RouterOutlet, CommonModule],
	templateUrl: './apps.component.html',
	styleUrl: './apps.component.scss',
	host: { style: 'display:flex;flex-direction:column;flex:1 1 auto;min-height:0;width:100%' },
})
export class AppsComponent {
	activeApp: string | null = null;

	apps: AppItem[] = [
		{
			name: 'Calculator',
			icon: 'fa-solid fa-calculator',
			route: '/apps/calculator',
			description: 'Basic calculator',
		},
		{
			name: 'Clock',
			icon: 'fa-solid fa-clock',
			route: '/apps/clock',
			description: 'Digital clock',
		},
		{
			name: 'Game',
			icon: 'fa-solid fa-gamepad',
			route: '/apps/game',
			description: 'Browser game',
		},
		{
			name: 'Sim',
			icon: 'fa-solid fa-cube',
			route: '/apps/sim',
			description: 'Graphics simulation',
		},
		{
			name: 'Sound',
			icon: 'fa-solid fa-music',
			route: '/apps/sound',
			description: 'Audio player',
		},
		{
			name: 'Editor',
			icon: 'fa-solid fa-code',
			route: '/apps/editor',
			description: 'Text editor',
		},
	];

	constructor(private router: Router) {
		this.router.events
			.pipe(filter((e) => e instanceof NavigationEnd))
			.subscribe((e) => {
				const url = (e as NavigationEnd).urlAfterRedirects;
				if (url === '/apps') {
					this.activeApp = null;
				} else {
					const app = this.apps.find((a) => url.startsWith(a.route));
					this.activeApp = app?.name ?? null;
				}
			});
	}

	openApp(app: AppItem): void {
		this.router.navigate([app.route]);
	}

	closeApp(): void {
		this.activeApp = null;
		this.router.navigate(['/apps']);
	}
}
