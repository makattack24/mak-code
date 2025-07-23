import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface TerminalLine {
  type: 'command' | 'output';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class TerminalCommandsService {
  constructor(private router: Router) { }

  getHandlers(lines: TerminalLine[], navigationHistory: string[]): { [key: string]: () => void } {
    const goAbout = () => {
      lines.push({ type: 'output', text: 'Navigating to about page.' });
      this.router.navigate(['/about']);
    };
    const goContact = () => {
      lines.push({ type: 'output', text: 'Navigating to contact page.' });
      this.router.navigate(['/contact']);
    };
    const goProjects = () => {
      lines.push({ type: 'output', text: 'Navigating to projects page.' });
      this.router.navigate(['/projects']);
    };
    const goHome = () => {
      lines.push({ type: 'output', text: 'Navigating to home page.' });
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
        lines.push({ type: 'output', text: 'Available commands: /about, /contact, /projects, /home, back' });
      },
      'back': () => {
        if (navigationHistory.length > 1) {
          // Remove current URL
          navigationHistory.pop();
          // Get previous URL
          const previousUrl = navigationHistory[navigationHistory.length - 1];
          if (previousUrl) {
            lines.push({ type: 'output', text: `Navigating to previous page: ${previousUrl}` });
            this.router.navigateByUrl(previousUrl);
          } else {
            lines.push({ type: 'output', text: 'No previous page in history.' });
          }
        } else {
          lines.push({ type: 'output', text: 'No previous page in history.' });
        }
      },
      'cls': () => { lines.length = 0; },
      'clear': () => { lines.length = 0; },
      'ls': () => { lines.push({ type: 'output', text: 'Available directories: /home, /about, /contact, /projects' }); },
      'kill': () => {
        const match = this.router.url.match(/^\/projects\/[^\/]+$/);
        if (match) {
          this.router.navigate(['/projects']);
          lines.push({ type: 'output', text: 'Closing the application.' });
        } else {
          lines.push({ type: 'output', text: 'No app is currently running.' });
        }
      },
      // 'end': () => {
      //   this.router.navigate(['/projects']);
      //   lines.push({ type: 'output', text: 'Closing the application...' });
      // }
    };
  }
}