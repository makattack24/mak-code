import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  display = '';
  keys = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  isMobile = false;

  ngOnInit() {
    this.checkMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 600;
  }

  press(key: string) {
    if (key === '=') {
      this.calculate();
    } else {
      this.display += key;
    }
  }

  clear() {
    this.display = '';
  }

  calculate() {
    try {
      // eslint-disable-next-line no-eval
      this.display = eval(this.display).toString();
    } catch {
      this.display = 'Error';
    }
  }

  onKey(event: KeyboardEvent) {
    const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/'];
    if (allowed.includes(event.key)) {
      this.display += event.key;
      event.preventDefault();
    } else if (event.key === 'Enter' || event.key === '=') {
      this.calculate();
      event.preventDefault();
    } else if (event.key === 'Backspace') {
      this.display = this.display.slice(0, -1);
      event.preventDefault();
    } else if (event.key.toLowerCase() === 'c') {
      this.clear();
      event.preventDefault();
    }
  }
}