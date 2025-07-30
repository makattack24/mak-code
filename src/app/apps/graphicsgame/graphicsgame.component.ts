import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-graphicsgame',
  imports: [],
  templateUrl: './graphicsgame.component.html',
  styleUrl: './graphicsgame.component.scss'
})
export class GraphicsgameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Set canvas size to match its displayed size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context');
      return;
    }

    let x = 50;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, canvas.height / 2, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#2563eb';
      ctx.fill();
      x = (x + 2) % canvas.width;
      requestAnimationFrame(draw);
    };
    draw();
  }
}