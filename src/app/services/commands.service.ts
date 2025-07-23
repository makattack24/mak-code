import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TerminalCommandsService {
  constructor(private router: Router) { }

  getHandlers(lines: string[], navigationHistory: string[]): { [key: string]: () => void } {
    const goAbout = () => {
      lines.push('Navigating to about page.');
      this.router.navigate(['/about']);
    };
    const goContact = () => {
      lines.push('Navigating to contact page.');
      this.router.navigate(['/contact']);
    };
    const goProjects = () => {
      lines.push('Navigating to projects page.');
      this.router.navigate(['/projects']);
    };
    const goHome = () => {
      lines.push('Navigating to home page.');
      this.router.navigate(['/home']);
    };
    return {
      'about': goAbout,
      '/about': goAbout,
      'contact': goContact,
      '/contact': goContact,
      'projects': goProjects,
      '/projects': goProjects,
      'home': goHome,
      '/home': goHome,
      'help': () => {
        lines.push('Available commands: /about, /contact, /projects, /home, back');
      },
      'back': () => {
        if (navigationHistory.length > 1) {
          navigationHistory.pop();
          const previousUrl = navigationHistory.pop();
          if (previousUrl) {
            lines.push(`Navigating to previous page: ${previousUrl}`);
            this.router.navigateByUrl(previousUrl);
          } else {
            lines.push('No previous page in history.');
          }
        } else {
          lines.push('No previous page in history.');
        }
      },
      'cls': () => { lines.length = 0; },
      'clear': () => { lines.length = 0; },
      'ls': () => { lines.push('Available directories: /home, /about, /contact, /projects'); }
    };
  }
}