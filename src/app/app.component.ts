import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';
import { GraphicsgameComponent } from './apps/graphicsgame/graphicsgame.component';
import { ResizeService } from './services/resize.service';

type PinPosition = 'center' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TerminalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(GraphicsgameComponent) graphicsGame?: GraphicsgameComponent;

  title = 'myweb';

  terminalHeight = 240; // CHANGED: Default height in px

  constructor(private resizeService: ResizeService) {}

  onTerminalHeightChange(newHeight: number) { // CHANGED
    this.terminalHeight = newHeight;
  }

  onTerminalResize(event: { height?: number }) {
    this.resizeService.triggerResize();
  }
}