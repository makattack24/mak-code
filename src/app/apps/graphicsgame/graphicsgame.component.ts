import {
	Component,
	ElementRef,
	ViewChild,
	AfterViewInit,
	OnDestroy,
} from '@angular/core';
import { ResizeService } from '../../services/resize.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-graphicsgame',
	imports: [],
	templateUrl: './graphicsgame.component.html',
	styleUrl: './graphicsgame.component.scss',
})
export class GraphicsgameComponent implements AfterViewInit, OnDestroy {
	@ViewChild('gameCanvas', { static: false })
	canvasRef!: ElementRef<HTMLCanvasElement>;
	private resizeSub?: Subscription;
	private animationId?: number;

	// --- Added: Store resetAllBalls function reference ---
	private resetAllBallsFn?: () => void;

	constructor(private resizeService: ResizeService) {}

	public resizeCanvas = () => {
		const canvas = this.canvasRef?.nativeElement;
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = parent.clientHeight;
		}
	};

	// --- Added: Manual restart method ---
	public restartSimulation() {
		if (this.resetAllBallsFn) {
			this.resetAllBallsFn();
		}
	}

	ngAfterViewInit() {
		this.resizeCanvas();
		window.addEventListener('resize', this.resizeCanvas);

		this.resizeSub = this.resizeService.resize$.subscribe(() => {
			this.resizeCanvas();
		});

		const canvas = this.canvasRef?.nativeElement;
		if (!canvas) {
			console.error('Canvas not found');
			return;
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('Unable to get 2D context');
			return;
		}

		const BALL_COUNT = 12;
		const balls: {
			x: number;
			y: number;
			vx: number;
			vy: number;
			r: number;
			color: string;
		}[] = [];

		function randomColor() {
			return `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
		}

		function randomBetween(a: number, b: number) {
			return a + Math.random() * (b - a);
		}

		function createBall() {
			const r = randomBetween(18, 32);
			return {
				x: randomBetween(r, canvas.width - r),
				y: randomBetween(r, canvas.height - r),
				vx: randomBetween(-2, 2),
				vy: randomBetween(-2, 2),
				r,
				color: randomColor(),
			};
		}

		function resetAllBalls() {
			balls.length = 0;
			for (let i = 0; i < BALL_COUNT; i++) {
				balls.push(createBall());
			}
		}

		// --- Added: Expose resetAllBalls to the component instance ---
		this.resetAllBallsFn = resetAllBalls;

		resetAllBalls();

		const gravity = 0.15;
		const friction = 0.995;
		const bounce = 0.85;

		let settledCount = 0;

		const draw = () => {
			ctx.fillStyle = 'rgba(24,26,32,0.18)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			settledCount = 0;

			for (const ball of balls) {
				ball.x += ball.vx;
				ball.y += ball.vy;
				ball.vy += gravity;

				if (ball.x - ball.r < 0) {
					ball.x = ball.r;
					ball.vx = -ball.vx * bounce;
				}
				if (ball.x + ball.r > canvas.width) {
					ball.x = canvas.width - ball.r;
					ball.vx = -ball.vx * bounce;
				}
				if (ball.y - ball.r < 0) {
					ball.y = ball.r;
					ball.vy = -ball.vy * bounce;
				}
				if (ball.y + ball.r > canvas.height) {
					ball.y = canvas.height - ball.r;
					ball.vy = -Math.abs(ball.vy) * bounce;
					ball.vx *= friction;
					if (Math.abs(ball.vy) < 0.5 && Math.abs(ball.vx) < 0.5) {
						settledCount++;
					}
				}

				ctx.beginPath();
				ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
				ctx.fillStyle = ball.color;
				ctx.shadowColor = ball.color;
				ctx.shadowBlur = 16;
				ctx.fill();
				ctx.shadowBlur = 0;
			}

			if (mouse.x !== null && mouse.y !== null) {
				ctx.beginPath();
				ctx.arc(mouse.x, mouse.y, 22, 0, 2 * Math.PI);
				ctx.fillStyle = 'rgba(96,165,250,0.25)';
				ctx.shadowColor = '#60a5fa';
				ctx.shadowBlur = 32;
				ctx.fill();
				ctx.shadowBlur = 0;
			}

			if (settledCount === BALL_COUNT) {
				setTimeout(() => {
					resetAllBalls();
				}, 800);
			}

			this.animationId = requestAnimationFrame(draw);
		};

		const mouse = { x: null as number | null, y: null as number | null };
		canvas.addEventListener('mousemove', (e) => {
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		});
		canvas.addEventListener('mouseleave', () => {
			mouse.x = null;
			mouse.y = null;
		});

		draw();
	}

	ngOnDestroy() {
		this.resizeSub?.unsubscribe();
		window.removeEventListener('resize', this.resizeCanvas);
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
		}
	}
}
