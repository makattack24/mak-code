import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';

type PinPosition = 'center' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TerminalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'myweb';

  terminalHeight = 240; // CHANGED: Default height in px

  onTerminalHeightChange(newHeight: number) { // CHANGED
    this.terminalHeight = newHeight;
  }
}