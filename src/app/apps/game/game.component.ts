import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	HostListener,
	NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
	x: number;
	y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const DIR_DELTA: Record<Direction, Point> = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
	UP: 'DOWN',
	DOWN: 'UP',
	LEFT: 'RIGHT',
	RIGHT: 'LEFT',
};

@Component({
	selector: 'app-game',
	imports: [CommonModule],
	standalone: true,
	templateUrl: './game.component.html',
	styleUrl: './game.component.scss',
})
export class GameComponent implements AfterViewInit, OnDestroy {
	@ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
	private ctx!: CanvasRenderingContext2D;
	private animFrameId = 0;
	private lastTick = 0;

	// ── Grid settings ──
	readonly cellSize = 20;
	cols = 20;
	rows = 20;

	// ── Game state ──
	snake: Point[] = [];
	private prevSnake: Point[] = []; // snapshot for interpolation
	direction: Direction = 'RIGHT';
	nextDirection: Direction = 'RIGHT';
	private inputQueue: Direction[] = [];
	food: Point = { x: 0, y: 0 };
	private removedTail: Point | null = null; // for tail interpolation
	score = 0;
	highScore = 0;
	gameOver = false;
	paused = false;
	started = false;

	// ── Speed (ms per tick) ──
	readonly baseSpeed = 180;
	get speed(): number {
		return Math.max(70, this.baseSpeed - this.score * 2.5);
	}

	// ── Food animation ──
	private foodPulse = 0;

	// ── Cached theme colors ──
	private themeColors = {
		surface: '#1e2028',
		surfaceRgb: '30,32,40',
		border: '#374151',
		primary: '#60a5fa',
		primaryRgb: '96,165,250',
		foreground: '#e0e0e0',
		muted: '#a1a1aa',
		error: '#f87171',
		success: '#4ade80',
	};

	// ── Touch handling ──
	private touchStartX = 0;
	private touchStartY = 0;

	constructor(private ngZone: NgZone) {
		try {
			const saved = localStorage.getItem('snake_highscore');
			if (saved) this.highScore = parseInt(saved, 10) || 0;
		} catch {}
	}

	ngAfterViewInit() {
		const canvas = this.canvasRef.nativeElement;
		this.ctx = canvas.getContext('2d')!;
		this.cacheThemeColors();
		this.resizeCanvas();
		this.drawStartScreen();
	}

	ngOnDestroy() {
		cancelAnimationFrame(this.animFrameId);
	}

	// ── Canvas sizing ──
	private resizeCanvas() {
		const canvas = this.canvasRef.nativeElement;
		const container = canvas.parentElement!;
		const maxW = container.clientWidth - 4;
		const maxH = container.clientHeight - 4;
		this.cols = Math.floor(maxW / this.cellSize);
		this.rows = Math.floor(maxH / this.cellSize);
		this.cols = Math.max(10, Math.min(this.cols, 40));
		this.rows = Math.max(10, Math.min(this.rows, 30));
		canvas.width = this.cols * this.cellSize;
		canvas.height = this.rows * this.cellSize;
	}

	private cacheThemeColors() {
		const style = getComputedStyle(document.documentElement);
		const primary = style.getPropertyValue('--primary').trim() || '#60a5fa';
		const surface = style.getPropertyValue('--surface').trim() || '#1e2028';
		this.themeColors = {
			surface,
			surfaceRgb: this.hexToRgb(surface),
			border: style.getPropertyValue('--border').trim() || '#374151',
			primary,
			primaryRgb: this.hexToRgb(primary),
			foreground: style.getPropertyValue('--foreground').trim() || '#e0e0e0',
			muted: style.getPropertyValue('--muted').trim() || '#a1a1aa',
			error: style.getPropertyValue('--error').trim() || '#f87171',
			success: style.getPropertyValue('--success').trim() || '#4ade80',
		};
	}

	private hexToRgb(hex: string): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `${r},${g},${b}`;
	}

	// ── Start / Reset ──
	startGame() {
		this.cacheThemeColors();
		this.resizeCanvas();
		const midX = Math.floor(this.cols / 2);
		const midY = Math.floor(this.rows / 2);
		this.snake = [
			{ x: midX, y: midY },
			{ x: midX - 1, y: midY },
			{ x: midX - 2, y: midY },
		];
		this.prevSnake = this.snake.map(s => ({ ...s }));
		this.direction = 'RIGHT';
		this.nextDirection = 'RIGHT';
		this.inputQueue = [];
		this.removedTail = null;
		this.score = 0;
		this.gameOver = false;
		this.paused = false;
		this.started = true;
		this.foodPulse = 0;
		this.spawnFood();
		this.lastTick = performance.now();

		cancelAnimationFrame(this.animFrameId);
		this.ngZone.runOutsideAngular(() => this.gameLoop(performance.now()));
	}

	// ── Game loop (renders EVERY frame, ticks at fixed intervals) ──
	private gameLoop(timestamp: number) {
		if (this.gameOver) return;
		if (this.paused) {
			this.animFrameId = requestAnimationFrame((t) => this.gameLoop(t));
			return;
		}

		const elapsed = timestamp - this.lastTick;
		const spd = this.speed;

		if (elapsed >= spd) {
			this.lastTick = timestamp - (elapsed % spd); // prevent drift
			this.tick();
		}

		// Interpolation factor: 0 = just ticked, 1 = about to tick
		const t = Math.min((timestamp - this.lastTick) / spd, 1);
		this.draw(t, timestamp);

		this.animFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
	}

	private tick() {
		// Snapshot current positions for interpolation
		this.prevSnake = this.snake.map(s => ({ ...s }));

		// Consume input queue
		if (this.inputQueue.length > 0) {
			this.nextDirection = this.inputQueue.shift()!;
		}
		this.direction = this.nextDirection;

		const head = { ...this.snake[0] };
		const d = DIR_DELTA[this.direction];
		head.x += d.x;
		head.y += d.y;

		// Wall collision
		if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
			this.endGame();
			return;
		}

		// Self collision (skip last segment — it will move away)
		for (let i = 0; i < this.snake.length - 1; i++) {
			if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
				this.endGame();
				return;
			}
		}

		this.snake.unshift(head);

		// Eat food?
		if (head.x === this.food.x && head.y === this.food.y) {
			this.score++;
			this.removedTail = null; // keep tail — snake grows
			if (this.score > this.highScore) {
				this.highScore = this.score;
				try { localStorage.setItem('snake_highscore', String(this.highScore)); } catch {}
			}
			this.spawnFood();
		} else {
			this.removedTail = this.snake.pop()!;
		}
	}

	private endGame() {
		this.gameOver = true;
		cancelAnimationFrame(this.animFrameId);
		this.draw(1, performance.now()); // final frame
		this.ngZone.run(() => {
			this.drawGameOver();
		});
	}

	// ── Food ──
	private spawnFood() {
		let pos: Point;
		do {
			pos = {
				x: Math.floor(Math.random() * this.cols),
				y: Math.floor(Math.random() * this.rows),
			};
		} while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
		this.food = pos;
	}

	// ── Interpolation helper ──
	private lerp(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

	private smoothStep(t: number): number {
		return t * t * (3 - 2 * t);
	}

	// ── Drawing (called every frame ~60fps) ──
	private draw(t: number, timestamp: number) {
		const ctx = this.ctx;
		const cs = this.cellSize;
		const w = this.cols * cs;
		const h = this.rows * cs;

		// Background
		ctx.fillStyle = this.themeColors.surface;
		ctx.fillRect(0, 0, w, h);

		// Grid lines
		ctx.strokeStyle = this.themeColors.border;
		ctx.lineWidth = 0.5;
		ctx.globalAlpha = 0.35;
		ctx.beginPath();
		for (let x = cs; x < w; x += cs) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, h);
		}
		for (let y = cs; y < h; y += cs) {
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
		}
		ctx.stroke();
		ctx.globalAlpha = 1;

		// ── Snake body (interpolated) ──
		const primary = this.themeColors.primary;
		const primaryRgb = this.themeColors.primaryRgb;
		const snakeLen = this.snake.length;

		for (let i = snakeLen - 1; i >= 0; i--) {
			const cur = this.snake[i];
			const prev = this.prevSnake[i] ?? cur;

			// Pure linear interpolation — constant speed, no acceleration
			let drawX = this.lerp(prev.x, cur.x, t);
			let drawY = this.lerp(prev.y, cur.y, t);

			// Handle edge case where segment jumped more than 1 cell
			if (Math.abs(cur.x - prev.x) > 1) drawX = cur.x;
			if (Math.abs(cur.y - prev.y) > 1) drawY = cur.y;

			const px = drawX * cs;
			const py = drawY * cs;

			// Gradient from head to tail
			const ratio = i / snakeLen;
			const alpha = 1 - ratio * 0.45;
			const pad = 1 + ratio * 0.5;
			const r = i === 0 ? 6 : 4;

			ctx.globalAlpha = alpha;
			ctx.fillStyle = `rgba(${primaryRgb},${alpha})`;
			this.roundRect(ctx, px + pad, py + pad, cs - pad * 2, cs - pad * 2, r);
			ctx.fill();

			// Subtle inner glow on head
			if (i === 0) {
				ctx.fillStyle = 'rgba(255,255,255,0.15)';
				this.roundRect(ctx, px + pad + 2, py + pad + 2, cs - pad * 2 - 4, (cs - pad * 2) / 2 - 2, 3);
				ctx.fill();
			}
		}
		ctx.globalAlpha = 1;

		// ── Disappearing tail (when not growing) ──
		if (this.removedTail && t < 0.6) {
			const tailAlpha = 0.3 * (1 - t / 0.6);
			ctx.globalAlpha = tailAlpha;
			ctx.fillStyle = primary;
			const tx = this.removedTail.x * cs;
			const ty = this.removedTail.y * cs;
			this.roundRect(ctx, tx + 2, ty + 2, cs - 4, cs - 4, 3);
			ctx.fill();
			ctx.globalAlpha = 1;
		}

		// ── Snake eyes (interpolated with head) ──
		const headCur = this.snake[0];
		const headPrev = this.prevSnake[0] ?? headCur;
		let hx = this.lerp(headPrev.x, headCur.x, t);
		let hy = this.lerp(headPrev.y, headCur.y, t);
		if (Math.abs(headCur.x - headPrev.x) > 1) hx = headCur.x;
		if (Math.abs(headCur.y - headPrev.y) > 1) hy = headCur.y;

		const cx = hx * cs + cs / 2;
		const cy = hy * cs + cs / 2;
		const eyeSize = 2.5;
		const eyeOff = 4;
		let e1x: number, e1y: number, e2x: number, e2y: number;

		switch (this.direction) {
			case 'RIGHT': e1x = cx + eyeOff; e1y = cy - eyeOff; e2x = cx + eyeOff; e2y = cy + eyeOff; break;
			case 'LEFT': e1x = cx - eyeOff; e1y = cy - eyeOff; e2x = cx - eyeOff; e2y = cy + eyeOff; break;
			case 'UP': e1x = cx - eyeOff; e1y = cy - eyeOff; e2x = cx + eyeOff; e2y = cy - eyeOff; break;
			case 'DOWN': e1x = cx - eyeOff; e1y = cy + eyeOff; e2x = cx + eyeOff; e2y = cy + eyeOff; break;
		}
		// Eye whites
		ctx.fillStyle = '#fff';
		ctx.beginPath(); ctx.arc(e1x!, e1y!, eyeSize + 1, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(e2x!, e2y!, eyeSize + 1, 0, Math.PI * 2); ctx.fill();
		// Pupils
		ctx.fillStyle = this.themeColors.surface;
		ctx.beginPath(); ctx.arc(e1x!, e1y!, eyeSize - 0.5, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(e2x!, e2y!, eyeSize - 0.5, 0, Math.PI * 2); ctx.fill();

		// ── Food (pulsing glow) ──
		this.foodPulse = timestamp * 0.004;
		const pulse = 0.85 + 0.15 * Math.sin(this.foodPulse);
		const foodR = (cs / 2 - 2) * pulse;
		const fx = this.food.x * cs + cs / 2;
		const fy = this.food.y * cs + cs / 2;

		// Glow
		const glow = ctx.createRadialGradient(fx, fy, foodR * 0.2, fx, fy, foodR * 2);
		glow.addColorStop(0, 'rgba(248,113,113,0.25)');
		glow.addColorStop(1, 'rgba(248,113,113,0)');
		ctx.fillStyle = glow;
		ctx.fillRect(fx - foodR * 2, fy - foodR * 2, foodR * 4, foodR * 4);

		// Food body
		ctx.fillStyle = this.themeColors.error;
		ctx.beginPath();
		ctx.arc(fx, fy, foodR, 0, Math.PI * 2);
		ctx.fill();

		// Shine
		ctx.fillStyle = 'rgba(255,255,255,0.35)';
		ctx.beginPath();
		ctx.arc(fx - 2, fy - 2, 2.5, 0, Math.PI * 2);
		ctx.fill();
	}

	private drawStartScreen() {
		const ctx = this.ctx;
		const w = this.cols * this.cellSize;
		const h = this.rows * this.cellSize;
		ctx.fillStyle = this.themeColors.surface;
		ctx.fillRect(0, 0, w, h);

		const fg = this.themeColors.foreground;
		const primary = this.themeColors.primary;
		const muted = this.themeColors.muted;

		ctx.textAlign = 'center';
		ctx.fillStyle = primary;
		ctx.font = 'bold 28px "JetBrains Mono", monospace';
		ctx.fillText('SNAKE', w / 2, h / 2 - 30);

		ctx.fillStyle = fg;
		ctx.font = '14px "JetBrains Mono", monospace';
		ctx.fillText('Press SPACE or tap START', w / 2, h / 2 + 10);

		ctx.fillStyle = muted;
		ctx.font = '12px "JetBrains Mono", monospace';
		ctx.fillText('Arrow keys / WASD / Swipe to move', w / 2, h / 2 + 40);
	}

	private drawGameOver() {
		const ctx = this.ctx;
		const w = this.cols * this.cellSize;
		const h = this.rows * this.cellSize;

		// Dim overlay
		ctx.fillStyle = 'rgba(0,0,0,0.6)';
		ctx.fillRect(0, 0, w, h);

		const error = this.themeColors.error;
		const fg = this.themeColors.foreground;
		const muted = this.themeColors.muted;

		ctx.textAlign = 'center';
		ctx.fillStyle = error;
		ctx.font = 'bold 28px "JetBrains Mono", monospace';
		ctx.fillText('GAME OVER', w / 2, h / 2 - 30);

		ctx.fillStyle = fg;
		ctx.font = '16px "JetBrains Mono", monospace';
		ctx.fillText(`Score: ${this.score}`, w / 2, h / 2 + 10);

		ctx.fillStyle = muted;
		ctx.font = '13px "JetBrains Mono", monospace';
		ctx.fillText('Press SPACE or tap to restart', w / 2, h / 2 + 45);
	}

	private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
	}

	// ── Keyboard input (with queue for fast direction changes) ──
	@HostListener('document:keydown', ['$event'])
	handleKey(e: KeyboardEvent) {
		// Start / restart
		if (e.code === 'Space') {
			e.preventDefault();
			if (!this.started || this.gameOver) {
				this.startGame();
				return;
			}
			this.paused = !this.paused;
			if (!this.paused) {
				this.lastTick = performance.now();
			} else {
				this.drawPausedOverlay();
			}
			return;
		}

		let newDir: Direction | null = null;
		switch (e.code) {
			case 'ArrowUp': case 'KeyW': newDir = 'UP'; break;
			case 'ArrowDown': case 'KeyS': newDir = 'DOWN'; break;
			case 'ArrowLeft': case 'KeyA': newDir = 'LEFT'; break;
			case 'ArrowRight': case 'KeyD': newDir = 'RIGHT'; break;
		}

		if (newDir) {
			e.preventDefault();
			this.queueDirection(newDir);
		}
	}

	private queueDirection(newDir: Direction) {
		// Determine what the effective current direction is
		const lastQueued = this.inputQueue.length > 0
			? this.inputQueue[this.inputQueue.length - 1]
			: this.nextDirection;

		// Don't allow reversals or same-direction
		if (newDir === lastQueued || newDir === OPPOSITE[lastQueued]) return;

		// Buffer up to 2 inputs for responsiveness
		if (this.inputQueue.length < 2) {
			this.inputQueue.push(newDir);
		}

		// Also set nextDirection immediately if queue was empty
		if (this.inputQueue.length === 1) {
			this.nextDirection = newDir;
		}
	}

	private drawPausedOverlay() {
		const ctx = this.ctx;
		const w = this.cols * this.cellSize;
		const h = this.rows * this.cellSize;
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect(0, 0, w, h);
		const fg = this.themeColors.foreground;
		ctx.textAlign = 'center';
		ctx.fillStyle = fg;
		ctx.font = 'bold 24px "JetBrains Mono", monospace';
		ctx.fillText('PAUSED', w / 2, h / 2);
		ctx.font = '13px "JetBrains Mono", monospace';
		ctx.fillText('Press SPACE to resume', w / 2, h / 2 + 30);
	}

	// ── Touch / swipe ──
	onTouchStart(e: TouchEvent) {
		this.touchStartX = e.touches[0].clientX;
		this.touchStartY = e.touches[0].clientY;
	}

	onTouchEnd(e: TouchEvent) {
		if (!this.started || this.gameOver) {
			this.startGame();
			return;
		}

		const dx = e.changedTouches[0].clientX - this.touchStartX;
		const dy = e.changedTouches[0].clientY - this.touchStartY;
		const absDx = Math.abs(dx);
		const absDy = Math.abs(dy);

		if (Math.max(absDx, absDy) < 20) return;

		if (absDx > absDy) {
			this.queueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
		} else {
			this.queueDirection(dy > 0 ? 'DOWN' : 'UP');
		}
	}
}
