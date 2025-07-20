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
    'You can use commands like "help, /projects, /contact, /about, visit "site name".',
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
    'run game': () => {
      this.lines.push('Launching game project...');
      this.router.navigate(['/projects/game']);
    },
    'run sim': () => {
      this.lines.push('Launching sim project...');
      this.router.navigate(['/projects/sim']);
    },
    'help': () => {
      this.lines.push('Available commands: help, /about, /contact, /projects, /home');
    },
    '/': () => {
      this.lines.push('Navigating to home page.');
      this.router.navigate(['/home']);
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

  processCommand(cmd: string) {
    console.log('Processing command:', cmd);
    if (!cmd) return;
    this.lines.push(`> ${cmd}`);
    const command = cmd.toLowerCase();

    // Enhanced "visit" command: supports many sites and common shortcuts
    if (command.startsWith('visit ')) {
      const site = cmd.substring(6).trim().toLowerCase();
      let url = '';

      // Common shortcuts
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
        'makattack24': 'https://github.com/makattack24?tab=repositories'
      };

      if (shortcuts[site]) {
        url = shortcuts[site];
      } else if (site.match(/^https?:\/\//)) {
        url = site;
      } else if (site.match(/\./)) {
        url = 'https://' + site;
      }

      if (url) {
        this.lines.push(`Opening ${url} in a new tab...`);
        window.open(url, '_blank');
      } else {
        this.lines.push(`Unknown site: ${site}`);
      }
      this.scrollToBottom();
      return;
    }

    const handler = this.commandHandlers[command];
    if (handler) {
      handler();
    } else {
      this.lines.push(`Unknown command: ${cmd}`);
    }
    this.scrollToBottom();
  }
}