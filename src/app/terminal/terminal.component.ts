import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {
  lines: string[] = ['Welcome to MyWeb Terminal! Type "help" for commands.'];
  input = '';

  handleInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.processCommand(this.input.trim());
      this.input = '';
    }
  }

  processCommand(cmd: string) {
    if (!cmd) return;
    this.lines.push(`> ${cmd}`);
    switch (cmd.toLowerCase()) {
      case 'help':
        this.lines.push('Available commands: about, contact, projects, help');
        break;
      case 'about':
        this.lines.push('This is a demo Angular terminal home page.');
        break;
      case 'contact':
        this.lines.push('Contact: you@example.com');
        break;
      case 'projects':
        this.lines.push('Project 1, Project 2, Project 3');
        break;
      case 'cls':
      case 'clear':
        this.lines = [];
        break;
      default:
        this.lines.push(`Unknown command: ${cmd}`);
    }
  }
}