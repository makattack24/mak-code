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
    const goApps = () => {
      lines.push({ type: 'output', text: 'Navigating to apps page.' });
      this.router.navigate(['/apps']);
    };
    const goHome = () => {
      lines.push({ type: 'output', text: 'Navigating to home page.' });
      this.router.navigate(['/home']);
    };
    const goAdmin = () => {
      lines.push({ type: 'output', text: 'Navigating to admin page.' });
      this.router.navigate(['/admin']);
    };
    const goLogin = () => {
      lines.push({ type: 'output', text: 'Navigating to login page.' });
      this.router.navigate(['/login']);
    };
    const goSignup = () => {
      lines.push({ type: 'output', text: 'Navigating to sign up page.' });
      this.router.navigate(['/signup']);
    };
    const goStats = () => {
      lines.push({ type: 'output', text: 'Navigating to stats page.' });
      this.router.navigate(['/stats']);
    };
    return {
      'about': goAbout,
      '/about': goAbout,
      'contact': goContact,
      '/contact': goContact,
      'apps': goApps,
      '/apps': goApps,
      'home': goHome,
      '/home': goHome,
      'admin': goAdmin,
      '/admin': goAdmin,
      'login': goLogin,
      '/login': goLogin,
      'signup': goSignup,
      '/signup': goSignup,
      'stats': goStats,
      '/stats': goStats,
      'help': () => {
        lines.push({ type: 'output', text: 'Available commands: /about, /contact, /apps, /home, /admin, back' });
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
      'ls': () => { lines.push({ type: 'output', text: 'Available directories: /home, /about, /contact, /apps' }); },
      'kill': () => {
        const match = this.router.url.match(/^\/apps\/[^\/]+$/);
        if (match) {
          this.router.navigate(['/apps']);
          lines.push({ type: 'output', text: 'Closing the application.' });
        } else {
          lines.push({ type: 'output', text: 'No app is currently running.' });
        }
      },
      '/': () => {
        lines.push({ type: 'output', text: 'Navigating to home page.' });
        this.router.navigate(['/home']);
      },
    };
  }
}