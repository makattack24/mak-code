import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ResizeService } from '../services/resize.service';
import { TerminalCommandsService } from '../services/commands.service';

@Component({
	selector: 'app-apps',
	imports: [RouterOutlet, CommonModule],
	templateUrl: './apps.component.html',
	styleUrl: './apps.component.scss',
})
export class AppsComponent {
	sidebarCollapsed = false;

	private lines: { type: 'command' | 'output'; text: string }[] = [];
	private navigationHistory: string[] = [];

	constructor(
		private resizeService: ResizeService,
		private commandsService: TerminalCommandsService,
		private router: Router
	) {}

	toggleSidebar() {
		this.sidebarCollapsed = !this.sidebarCollapsed;
		setTimeout(() => {
			this.resizeService.triggerResize();
		}, 0);
	}

	runCommand(command: string) {
		// Add to history
		this.navigationHistory.push(this.router.url);

		// Get handlers
		const handlers = this.commandsService.getHandlers(
			this.lines,
			this.navigationHistory
		);

		// Remove "run " prefix if present
		const cmd = command.startsWith('run ') ? command.slice(4) : command;

		// Map sidebar commands to routes or handlers
		switch (cmd) {
			case 'calc':
				this.router.navigate(['/apps/calculator']);
				break;
			case 'time':
				this.router.navigate(['/apps/clock']);
				break;
			case 'game':
				this.router.navigate(['/apps/graphicsgame']);
				break;
			case 'sim':
				this.router.navigate(['/apps/sim']);
				break;
			case 'song':
				this.router.navigate(['/apps/sound']);
				break;
			case 'text':
				this.router.navigate(['/apps/editor']);
				break;
			case 'kill':
				if (handlers['kill']) handlers['kill']();
				break;
			default:
				// fallback: try handler
				if (handlers[cmd]) {
					handlers[cmd]();
				} else {
					this.lines.push({
						type: 'output',
						text: `Unknown command: ${command}`,
					});
				}
		}
	}
}
