import { CommonModule } from '@angular/common';
import { Output, EventEmitter, Input, Component, AfterViewInit, AfterViewChecked, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../themetoggle/themetoggle.component';
import { TerminalCommandsService } from '../services/commands.service';

type PinPosition = 'center' | 'bottom' | 'left' | 'right';

interface TerminalLine {
	type: 'command' | 'output';
	text: string;
}

@Component({
	selector: 'app-terminal',
	standalone: true,
	imports: [FormsModule, CommonModule, ThemeToggleComponent],
	templateUrl: './terminal.component.html',
	styleUrl: './terminal.component.scss'
})
export class TerminalComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
	@Input() pinPosition: PinPosition = 'bottom';
	@Output() pinPositionChange = new EventEmitter<PinPosition>();
	@Output() resize = new EventEmitter<{ width?: number, height?: number }>();
	@ViewChild('terminalInput', { static: false }) terminalInput?: ElementRef<HTMLInputElement>;
	@ViewChild('linesContainer', { static: false }) linesContainer?: ElementRef<HTMLDivElement>;
	@Input() height: number | undefined;
	@Output() heightChange = new EventEmitter<number>();
	@ViewChild('resizeHandle', { static: false }) resizeHandle?: ElementRef<HTMLDivElement>;

	isMinimized = false;
	minHeight = 80;
	maxHeight = 500;
	lines: TerminalLine[] = [
		{ type: 'output', text: 'You can use commands like "help, /projects, /contact, /about, or visit "site name".' },
		{ type: 'output', text: '---Version 0.0.1 alpha---' },
		{ type: 'output', text: 'Want to know more about this project? Visit this <a href="https://github.com/makattack24?tab=repositories" target="_blank">github</a> page.' },
		{ type: 'output', text: '------------------------------------------------------------------------------------------' },
	];

	input = '';
	history: string[] = [];
	historyIndex = -1;
	autocompleteList: string[] = ['about', 'contact', 'projects', 'help', 'cls', 'clear', 'home'];
	isInputFocused = false;

	private shouldAutoScroll = true;
	private scrollListener: (() => void) | null = null;
	private commandHandlers: { [key: string]: () => void };
	private resizing = false;
	private startY = 0;
	private startHeight = 0;
	private navigationHistory: string[] = [];

	constructor(
		private renderer: Renderer2,
		private el: ElementRef,
		private router: Router,
		private commandsService: TerminalCommandsService
	) {
		this.commandHandlers = this.commandsService.getHandlers(this.lines, this.navigationHistory);
		this.router.events.subscribe(event => {
			const url = (event as any).url;
			if (url && url !== this.navigationHistory[this.navigationHistory.length - 1]) {
				this.navigationHistory.push(url);
				if (this.navigationHistory.length > 50) {
					this.navigationHistory.shift();
				}
			}
		});
	}

	ngAfterViewInit() {
		this.focusInput();
		this.scrollToBottom(true);

		if (this.linesContainer?.nativeElement) {
			this.scrollListener = this.renderer.listen(
				this.linesContainer.nativeElement,
				'scroll',
				() => {
					this.shouldAutoScroll = this.isUserAtBottom();
				}
			);
		}

		if (this.resizeHandle?.nativeElement) {
			this.renderer.listen(this.resizeHandle.nativeElement, 'mousedown', (event: MouseEvent) => this.onResizeStart(event));
		}
	}

	ngOnDestroy() {
		if (this.scrollListener) {
			this.scrollListener();
			this.scrollListener = null;
		}
		this.removeResizeListeners();
	}

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	private isUserAtBottom(): boolean {
		const el = this.linesContainer?.nativeElement;
		if (!el) return true;
		return el.scrollHeight - el.scrollTop - el.clientHeight < 5;
	}

	private scrollToBottom(force = false) {
		setTimeout(() => {
			const el = this.linesContainer?.nativeElement;
			if (el && (force || this.shouldAutoScroll)) {
				el.scrollTop = el.scrollHeight;
			}
		}, 0);
	}

	focusInput() {
		setTimeout(() => {
			this.terminalInput?.nativeElement.focus();
		}, 0);
	}

	handleInput(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (this.input.trim()) {
				this.processCommand(this.input.trim());
				this.history.push(this.input.trim());
				this.historyIndex = this.history.length;
				this.input = '';
			}
		} else if (event.key === 'ArrowUp') {
			if (this.history.length > 0) {
				if (this.historyIndex > 0) {
					this.historyIndex--;
				} else {
					this.historyIndex = 0;
				}
				this.input = this.history[this.historyIndex];
				setTimeout(() => this.terminalInput?.nativeElement.select(), 0);
			}
		} else if (event.key === 'ArrowDown') {
			if (this.history.length > 0) {
				if (this.historyIndex < this.history.length - 1) {
					this.historyIndex++;
					this.input = this.history[this.historyIndex];
				} else {
					this.historyIndex = this.history.length;
					this.input = '';
				}
				setTimeout(() => this.terminalInput?.nativeElement.select(), 0);
			}
		}
	}

	processCommand(cmd: string) {
		if (!cmd) return;
		this.lines.push({ type: 'command', text: `> ${cmd}` });
		const command = cmd.toLowerCase();

		if (command.startsWith('run ')) {
			const project = command.substring(4).trim();
			const projectRoutes: { [key: string]: string } = {
				'calc': '/projects/calculator',
				'calculator': '/projects/calculator',
				'clock': '/projects/clock',
				'game': '/projects/game',
				'sim': '/projects/sim',
				'song': '/projects/sound',
				'text': '/projects/editor',
			};
			const route = projectRoutes[project];
			if (route) {
				this.lines.push({ type: 'output', text: `Running ${project}...` });
				this.router.navigate([route]);
			} else {
				this.lines.push({ type: 'output', text: `Unknown project: ${project}` });
			}
			this.scrollToBottom();
			return;
		}

		if (command.startsWith('visit ')) {
			const site = cmd.substring(6).trim().toLowerCase();
			let url = '';

			const shortcuts: { [key: string]: string } = {
				'github': 'https://github.com/',
				'google': 'https://www.google.com/',
				'youtube': 'https://www.youtube.com/',
				'twitter': 'https://twitter.com/',
				'reddit': 'https://www.reddit.com/',
				'facebook': 'https://www.facebook.com/',
				'linkedin': 'https://www.linkedin.com/',
				'stackoverflow': 'https://stackoverflow.com/',
				'npm': 'https://www.npmjs.com/',
				'angular': 'https://angular.io/',
				'docs': 'https://angular.dev/docs',
				'wikipedia': 'https://en.wikipedia.org/',
				'bing': 'https://www.bing.com/',
				'amazon': 'https://www.amazon.com/',
				'netflix': 'https://www.netflix.com/',
				'makattack24': 'https://github.com/makattack24?tab=repositories',
				'trezyn': 'https://soundcloud.com/trezyn',
				'soundcloud': 'https://soundcloud.com/',
			};

			if (shortcuts[site]) {
				url = shortcuts[site];
			} else if (site.match(/^https?:\/\//)) {
				url = site;
			} else if (site.match(/\./)) {
				url = 'https://' + site;
			}

			if (url) {
				this.lines.push({ type: 'output', text: `Opening ${url} in a new tab...` });
				window.open(url, '_blank');
			} else {
				this.lines.push({ type: 'output', text: `Unknown site: ${site}` });
			}
			this.scrollToBottom();
			return;
		}

		const handler = this.commandHandlers[command];
		if (handler) {
			handler();
		} else {
			try {
				if (/^[\d+\-*/().\s%]+$/.test(cmd)) {
					// eslint-disable-next-line no-new-func
					const result = Function(`"use strict";return (${cmd})`)();
					if (typeof result === 'number' && isFinite(result)) {
						this.lines.push({ type: 'output', text: result.toString() });
					} else {
						this.lines.push({ type: 'output', text: 'Invalid expression.' });
					}
				} else {
					this.lines.push({ type: 'output', text: `Unknown command: ${cmd}` });
				}
			} catch {
				this.lines.push({ type: 'output', text: 'Invalid expression.' });
			}
		}
		this.scrollToBottom();
	}

	onResizeStart(event: MouseEvent) {
		event.preventDefault();
		this.resizing = true;
		this.startY = event.clientY;
		this.startHeight = this.height ?? this.minHeight;
		this.renderer.addClass(document.body, 'resizing-terminal');
		window.addEventListener('mousemove', this.onResizing);
		window.addEventListener('mouseup', this.onResizeEnd);
	}

	onResizing = (event: MouseEvent) => {
		if (!this.resizing) return;
		const delta = this.startY - event.clientY;
		let newHeight = this.startHeight + delta;
		newHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight));

		const snapThreshold = 40;
		const windowHeight = window.innerHeight;
		const mouseY = event.clientY;

		// Minimize if dragged to bottom
		if (windowHeight - mouseY < snapThreshold) {
			this.isMinimized = true;
			this.height = this.minHeight;
			this.heightChange.emit(this.height);
			this.resize.emit({ height: this.height });
			this.resizing = false;
			this.renderer.removeClass(document.body, 'resizing-terminal');
			window.removeEventListener('mousemove', this.onResizing);
			window.removeEventListener('mouseup', this.onResizeEnd);
			return;
		}

		// Restore if dragging up while minimized
		if (this.isMinimized && newHeight > this.minHeight + 30) {
			this.restoreTerminal();
		}

		this.height = newHeight;
		this.heightChange.emit(this.height);
		this.resize.emit({ height: this.height });
	};

	minimizeTerminal() {
		this.isMinimized = true;
		this.height = this.minHeight;
		this.heightChange.emit(this.height);
		this.resize.emit({ height: this.height });
	}

	restoreTerminal() {
		this.isMinimized = false;
		this.height = 300; // Or your preferred default height
		this.heightChange.emit(this.height);
		this.resize.emit({ height: this.height });
		setTimeout(() => this.focusInput(), 0);
	}

	onResizeEnd = () => {
		if (!this.resizing) return;
		this.resizing = false;
		this.renderer.removeClass(document.body, 'resizing-terminal');
		window.removeEventListener('mousemove', this.onResizing);
		window.removeEventListener('mouseup', this.onResizeEnd);
	};

	private removeResizeListeners() {
		window.removeEventListener('mousemove', this.onResizing);
		window.removeEventListener('mouseup', this.onResizeEnd);
	}
}