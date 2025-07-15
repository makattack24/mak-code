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
  private resizing = false;
  private lastPageX = 0;
  private lastPageY = 0;
  isMinimized = false;

  lines: string[] = [
    'Welcome to MyWeb Terminal! Type "help" for commands.',
    'This terminal lets you navigate and interact with the site using commands, just like a real terminal.',
    'You can use commands like "help, "/projects", "/contact", "/about".',
    'Type "cls" or "clear" to clear the terminal output.',
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
    'kill clock': () => {
      this.lines.push('Killing clock project...');
      this.router.navigate(['/projects']);
    },
    'kill calc': () => {
      this.lines.push('Killing calculator project...');
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

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.lines.push('Terminal minimized. Click to restore.');
    } else {
      this.lines.push('Terminal restored.');
    }
    this.scrollToBottom(true);
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

  startResize(event: MouseEvent | TouchEvent, position: PinPosition) {
    event.preventDefault();
    this.resizing = true;
    if (event instanceof MouseEvent) {
      this.lastPageX = event.pageX;
      this.lastPageY = event.pageY;
      window.addEventListener('mousemove', this.onResize);
      window.addEventListener('mouseup', this.stopResize);
    } else if (event instanceof TouchEvent) {
      this.lastPageX = event.touches[0].pageX;
      this.lastPageY = event.touches[0].pageY;
      window.addEventListener('touchmove', this.onResize);
      window.addEventListener('touchend', this.stopResize);
    }
  }

  onResize = (event: MouseEvent | TouchEvent) => {
    if (!this.resizing) return;
    let deltaX = 0, deltaY = 0;
    if (event instanceof MouseEvent) {
      deltaX = event.pageX - this.lastPageX;
      deltaY = event.pageY - this.lastPageY;
      this.lastPageX = event.pageX;
      this.lastPageY = event.pageY;
    } else if (event instanceof TouchEvent) {
      deltaX = event.touches[0].pageX - this.lastPageX;
      deltaY = event.touches[0].pageY - this.lastPageY;
      this.lastPageX = event.touches[0].pageX;
      this.lastPageY = event.touches[0].pageY;
    }
    const container = document.querySelector('.terminal-container.' + this.pinPosition) as HTMLElement;
    if (!container) return;
    if (this.pinPosition === 'bottom') {
      const newHeight = Math.max(120, container.offsetHeight - deltaY);
      container.style.height = newHeight + 'px';
      this.resize.emit({ height: newHeight });
    } else if (this.pinPosition === 'left' || this.pinPosition === 'right') {
      const newWidth = Math.max(180, container.offsetWidth + (this.pinPosition === 'left' ? deltaX : -deltaX));
      container.style.width = newWidth + 'px';
      this.resize.emit({ width: newWidth });
    }
  };

  stopResize = () => {
    this.resizing = false;
    window.removeEventListener('mousemove', this.onResize);
    window.removeEventListener('mouseup', this.stopResize);
    window.removeEventListener('touchmove', this.onResize);
    window.removeEventListener('touchend', this.stopResize);
  };
}