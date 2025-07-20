import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

type PinPosition = 'center' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'myweb';

  terminalPosition: PinPosition = 'bottom';
  terminalSize: { width?: number; height?: number } = {};

  onTerminalPositionChange(pos: PinPosition) {
    this.terminalPosition = pos;
  }

  onTerminalResize(size: { width?: number; height?: number }) {
    this.terminalSize = size;
  }
}