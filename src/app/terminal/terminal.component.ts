import { CommonModule } from '@angular/common';
import { Output, EventEmitter, Input, Component, AfterViewInit, AfterViewChecked, ElementRef, Renderer2, ViewChild, OnDestroy, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../themetoggle/themetoggle.component';

type PinPosition = 'center' | 'bottom' | 'left' | 'right';

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


  isMinimized = false;
  minHeight = '40vh'; // Default minimum height
  lines: string[] = [
    'You can use commands like "help, "/projects", "/contact", "/about".',
    '---Version 0.0.1 alpha---',
    'Want to know more about this project? Visit this <a href="https://github.com/makattack24?tab=repositories" target="_blank">github</a> page.',
    '------------------------------------------------------------------------------------------',
  ];

  input = '';
  history: string[] = [];
  historyIndex = -1;
  autocompleteList: string[] = ['about', 'contact', 'projects', 'help', 'cls', 'clear', 'home'];
  isInputFocused = false;

  // Track if user is at the bottom
  private shouldAutoScroll = true;
  private scrollListener: (() => void) | null = null;

  private commandHandlers: { [key: string]: () => void } = {
    'kill': () => {
      this.lines.push('Terminating application...');
      this.router.navigate(['/projects']);
    },
    'run calc': () => {
      this.lines.push('Launching calculator project...');
      this.router.navigate(['/projects/calculator']);
    },
    'run clock': () => {
      this.lines.push('Launching clock project...');
      this.router.navigate(['/projects/clock']);
    },
    'help': () => {
      this.lines.push('Available commands: help, /about, /contact, /projects, /home');
    },
    '/home': () => {
      this.lines.push('Navigating to home page.');
      this.router.navigate(['/home']);
    },
    '/about': () => {
      this.lines.push('Navigating to about page.');
      this.router.navigate(['/about']);
    },
    '/contact': () => {
      this.lines.push('Navigating to contact page.');
      this.router.navigate(['/contact']);
    },
    '/projects': () => {
      this.lines.push('Navigating to projects page.');
      this.router.navigate(['/projects']);
    },
    'cls': () => {
      this.lines = [];
    },
    'clear': () => {
      this.lines = [];
    },
    'ls': () => {
      this.lines.push('Available directories: /home, /about, /contact, /projects');
    }
  };

  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) { }

  ngAfterViewInit() {
    this.focusInput();
    this.scrollToBottom(true);

    // Attach scroll event listener
    if (this.linesContainer?.nativeElement) {
      this.scrollListener = this.renderer.listen(
        this.linesContainer.nativeElement,
        'scroll',
        () => {
          this.shouldAutoScroll = this.isUserAtBottom();
        }
      );
    }
  }

  ngOnDestroy() {
    // Clean up scroll listener
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private isUserAtBottom(): boolean {
    const el = this.linesContainer?.nativeElement;
    if (!el) return true;
    // Allow a small threshold for "almost at bottom"
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
      this.processCommand(this.input.trim());
      this.input = '';
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  processCommand(cmd: string) {
    console.log('Processing command:', cmd);
    if (!cmd) return;
    this.lines.push(`> ${cmd}`);
    const command = cmd.toLowerCase();
    const handler = this.commandHandlers[command];
    if (handler) {
      handler();
    } else {
      this.lines.push(`Unknown command: ${cmd}`);
    }
    this.scrollToBottom();
  }

  setPinPosition(pos: PinPosition) {
    this.pinPositionChange.emit(pos);
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }
}