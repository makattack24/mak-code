import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, AfterViewChecked, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
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
  @ViewChild('terminalInput', { static: false }) terminalInput?: ElementRef<HTMLInputElement>;
  @ViewChild('linesContainer', { static: false }) linesContainer?: ElementRef<HTMLDivElement>;
  private resizing = false;
  private lastPageX = 0;
  private lastPageY = 0;
  isMinimized = false;

  lines: string[] = [
    'Welcome to MyWeb Terminal! Type "help" for commands.',
    'This terminal lets you navigate and interact with the site using commands, just like a real terminal.',
    'You can use commands like "about", "contact", "projects", and "help".',
    'Type "cls" or "clear" to clear the terminal output.',
  ];
  input = '';
  pinPosition: PinPosition = 'bottom';

  history: string[] = [];
  historyIndex = -1;
  autocompleteList: string[] = ['about', 'contact', 'projects', 'help', 'cls', 'clear', 'home'];
  isInputFocused = false;

  // Track if user is at the bottom
  private shouldAutoScroll = true;
  private scrollListener: (() => void) | null = null;

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
    // If currently centered, move to bottom before minimizing
    if (this.pinPosition === 'center') {
      this.pinPosition = 'bottom';
    }
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
    if (!cmd) return;
    this.lines.push(`> ${cmd}`);
    switch (cmd.toLowerCase()) {
      case 'kill calc':
        this.lines.push('Killing calculator project...');
        this.router.navigate(['/projects']);
        break;
      case 'run calc':
        this.lines.push('Launching calculator project...');
        this.router.navigate(['/projects/calculator']);
        break;
      case 'help':
        this.lines.push('Available commands: about, contact, projects, help, home');
        break;
      case 'home':
        this.lines.push('Navigating to home page.');
        this.router.navigate(['/home']);
        break;
      case 'about':
        this.lines.push('Navigating to about page.');
        this.router.navigate(['/about']);
        break;
      case 'contact':
        this.lines.push('Navigating to contact page.');
        this.router.navigate(['/contact']);
        break;
      case 'projects':
        this.lines.push('Navigating to projects page.');
        this.router.navigate(['/projects']);
        break;
      case 'cls':
      case 'clear':
        this.lines = [];
        break;
      case 'ls':
        this.lines.push('Available directories: /home, /about, /contact, /projects');
        break;
      default:
        this.lines.push(`Unknown command: ${cmd}`);
    }
    this.scrollToBottom();
  }

  setPinPosition(pos: PinPosition) {
    this.pinPosition = pos;
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
    } else if (this.pinPosition === 'left' || this.pinPosition === 'right') {
      const newWidth = Math.max(180, container.offsetWidth + (this.pinPosition === 'left' ? deltaX : -deltaX));
      container.style.width = newWidth + 'px';
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