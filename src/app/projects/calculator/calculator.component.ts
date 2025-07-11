import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit, OnDestroy {
  display = '';
  keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];

  // Drag state
  position = { x: 0, y: 0 };
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  private calcWidth = 240;
  private calcHeight = 320;
  private margin = 24;

  isMobile = false;

  ngOnInit() {
    this.checkMobile();
    if (!this.isMobile) {
      this.setInitialPosition();
      window.addEventListener('resize', this.onResize);
    }
  }

  ngOnDestroy() {
    if (!this.isMobile) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 600;
  }

  private setInitialPosition() {
    this.position.x = window.innerWidth - this.calcWidth - this.margin;
    this.position.y = this.margin;
    this.clampPosition();
  }

  private clampPosition() {
    const parent = (document.querySelector('.projects-side') as HTMLElement);
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const calcRect = { width: this.calcWidth, height: this.calcHeight };
    const minX = 0;
    const minY = 0;
    const maxX = parentRect.width - calcRect.width;
    const maxY = parentRect.height - calcRect.height;
    this.position.x = Math.max(minX, Math.min(this.position.x, maxX));
    this.position.y = Math.max(minY, Math.min(this.position.y, maxY));
  }

  onResize = () => {
    this.checkMobile();
    if (!this.isMobile) {
      this.clampPosition();
    }
  };

  press(key: string) {
    this.display += key;
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

  startDrag(event: MouseEvent) {
    if (this.isMobile) return;
    this.dragging = true;
    this.dragOffset.x = event.clientX - this.position.x;
    this.dragOffset.y = event.clientY - this.position.y;
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  onDrag = (event: MouseEvent) => {
    if (!this.dragging || this.isMobile) return;
    this.position.x = event.clientX - this.dragOffset.x;
    this.position.y = event.clientY - this.dragOffset.y;
    this.clampPosition();
  };

  stopDrag = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  };
}