import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GraphicsgameComponent } from './apps/graphicsgame/graphicsgame.component';
import { ResizeService } from './services/resize.service';
import { HttpClient } from '@angular/common/http';

type PinPosition = 'center' | 'bottom' | 'left' | 'right';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, CommonModule, TerminalComponent, NavbarComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
	@ViewChild(GraphicsgameComponent) graphicsGame?: GraphicsgameComponent;

	title = 'myweb';

	terminalHeight = 240;
	terminalVisible = true;

	constructor(
		private resizeService: ResizeService,
		private http: HttpClient
	) {}

	ngOnInit(): void {
		this.http.get('/.netlify/functions/logs').subscribe({
			next: (res) => console.log('Visit logged:', res),
			error: (err) => console.error('Error logging visit:', err),
		});
	}

	onTerminalHeightChange(newHeight: number) {
		// CHANGED
		this.terminalHeight = newHeight;
	}

	onTerminalResize(event: { height?: number }) {
		this.resizeService.triggerResize();
	}

	onToggleTerminal(): void {
		this.terminalVisible = !this.terminalVisible;
		this.resizeService.triggerResize();
	}
}
