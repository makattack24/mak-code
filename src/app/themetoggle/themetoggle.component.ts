import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-themetoggle',
  standalone: true,
  template: `
    <button (click)="toggleTheme()" [attr.aria-label]="'Toggle theme'">
      {{ theme === 'dark' ? '🌙' : '☀️' }}
    </button>
  `,
  styles: [`
    button {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--primary);
      transition: color 0.2s;
    }
    button:hover, button:focus {
      color: var(--accent);
    }
  `]
})
export class ThemeToggleComponent {
  @Input() theme: 'light' | 'dark' = 'dark';

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      this.theme = saved;
      document.documentElement.setAttribute('data-theme', this.theme);
    }
  }
}