import {
	Component,
	ElementRef,
	ViewChild,
	AfterViewInit,
	NgZone,
	OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf, NgFor } from '@angular/common';

export interface Song {
	title: string;
	artist: string;
	src: string;
}

@Component({
	selector: 'app-sound',
	standalone: true,
	imports: [FormsModule, DatePipe, NgIf, NgFor],
	templateUrl: './sound.component.html',
	styleUrl: './sound.component.scss',
})
export class SoundComponent implements AfterViewInit, OnDestroy {
	@ViewChild('waveCanvas', { static: false })
	canvasRef!: ElementRef<HTMLCanvasElement>;
	@ViewChild('audioRef', { static: false })
	audioRef!: ElementRef<HTMLAudioElement>;

	// ── Playlist ──
	songs: Song[] = [
		{ title: 'Test Track', artist: 'Unknown Artist', src: '/assets/test.mp3' },
		{ title: 'Wanted', artist: 'Trezyn', src: '/assets/wanted.mp3' }
	];
	currentIndex = 0;

	// ── Player state ──
	isPlaying = false;
	isMuted = false;
	duration = 0;
	currentTime = 0;
	volume = 1;
	shuffle = false;
	repeat: 'none' | 'all' | 'one' = 'none';

	private previousVolume = 1;
	private audioCtx!: AudioContext;
	private analyser!: AnalyserNode;
	private sourceCreated = false;
	private animId = 0;

	get currentSong(): Song {
		return this.songs[this.currentIndex];
	}

	get progressPercent(): number {
		return this.duration ? (this.currentTime / this.duration) * 100 : 0;
	}

	constructor(private ngZone: NgZone) {}

	ngAfterViewInit() {
		const audio = this.audioRef.nativeElement;

		this.ngZone.run(() => {
			audio.addEventListener('loadedmetadata', () => {
				this.ngZone.run(() => {
					this.currentTime = 0;
					this.duration = audio.duration;
				});
			});
			audio.addEventListener('timeupdate', () => {
				this.ngZone.run(() => {
					this.currentTime = audio.currentTime;
				});
			});
			audio.addEventListener('ended', () => {
				this.ngZone.run(() => this.handleTrackEnd());
			});
			audio.addEventListener('error', () => {
				console.error('Audio load error:', audio.error);
			});
		});

		audio.addEventListener('play', () => this.startVisualizer());
		audio.volume = this.volume;
	}

	ngOnDestroy() {
		cancelAnimationFrame(this.animId);
		if (this.audioCtx && this.audioCtx.state !== 'closed') {
			this.audioCtx.close();
		}
	}

	// ── Visualizer ──
	private startVisualizer() {
		const canvas = this.canvasRef.nativeElement;
		const audio = this.audioRef.nativeElement;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		if (!this.sourceCreated) {
			const source = this.audioCtx.createMediaElementSource(audio);
			source.connect(this.analyser);
			this.analyser.connect(this.audioCtx.destination);
			this.sourceCreated = true;
		}

		this.analyser.fftSize = 256;
		const bufferLength = this.analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const draw = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.analyser.getByteFrequencyData(dataArray);

			const barWidth = (canvas.width / bufferLength) * 1.5;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

				// Gradient per bar
				const hue = (i / bufferLength) * 220 + 200; // blue → purple range
				ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.85)`;

				const radius = Math.min(barWidth / 2, 3);
				const bx = x;
				const by = canvas.height - barHeight;
				const bw = barWidth - 1;
				const bh = barHeight;

				ctx.beginPath();
				ctx.moveTo(bx + radius, by);
				ctx.lineTo(bx + bw - radius, by);
				ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + radius);
				ctx.lineTo(bx + bw, by + bh);
				ctx.lineTo(bx, by + bh);
				ctx.lineTo(bx, by + radius);
				ctx.quadraticCurveTo(bx, by, bx + radius, by);
				ctx.fill();

				x += barWidth;
			}

			if (!audio.paused) {
				this.animId = requestAnimationFrame(draw);
			}
		};
		draw();
	}

	// ── Playback controls ──
	private ensureAudioContext() {
		if (!this.audioCtx) {
			this.audioCtx = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			this.analyser = this.audioCtx.createAnalyser();
		}
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume();
		}
	}

	togglePlay() {
		const audio = this.audioRef.nativeElement;
		this.ensureAudioContext();

		if (audio.paused) {
			audio.play().catch((err) => console.error('Play failed:', err));
			this.isPlaying = true;
		} else {
			audio.pause();
			this.isPlaying = false;
		}
	}

	playSong(index: number) {
		if (index < 0 || index >= this.songs.length) return;
		this.currentIndex = index;
		const audio = this.audioRef.nativeElement;

		// Pause any in-flight playback before changing source
		audio.pause();
		audio.src = this.currentSong.src;
		audio.load();
		this.ensureAudioContext();

		// Wait until the browser has enough data, then play
		audio.addEventListener(
			'canplay',
			() => {
				audio.play().catch((err) => console.error('Play failed:', err));
				this.isPlaying = true;
			},
			{ once: true }
		);
	}

	prevTrack() {
		if (this.currentTime > 3) {
			// Restart current track if more than 3s in
			const audio = this.audioRef.nativeElement;
			audio.currentTime = 0;
			return;
		}
		const prev = this.shuffle
			? this.randomIndex()
			: (this.currentIndex - 1 + this.songs.length) % this.songs.length;
		this.playSong(prev);
	}

	nextTrack() {
		const next = this.shuffle
			? this.randomIndex()
			: (this.currentIndex + 1) % this.songs.length;
		this.playSong(next);
	}

	private handleTrackEnd() {
		if (this.repeat === 'one') {
			this.playSong(this.currentIndex);
		} else if (this.repeat === 'all' || this.currentIndex < this.songs.length - 1) {
			this.nextTrack();
		} else {
			this.isPlaying = false;
		}
	}

	private randomIndex(): number {
		if (this.songs.length <= 1) return 0;
		let idx: number;
		do {
			idx = Math.floor(Math.random() * this.songs.length);
		} while (idx === this.currentIndex);
		return idx;
	}

	// ── Repeat / Shuffle ──
	cycleRepeat() {
		const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
		const i = modes.indexOf(this.repeat);
		this.repeat = modes[(i + 1) % modes.length];
	}

	get repeatIcon(): string {
		if (this.repeat === 'one') return 'repeat_one';
		return 'repeat';
	}

	toggleShuffle() {
		this.shuffle = !this.shuffle;
	}

	// ── Seeking / Volume ──
	seekAudio(event: Event) {
		const audio = this.audioRef.nativeElement;
		const value = (event.target as HTMLInputElement).value;
		audio.currentTime = parseFloat(value);
	}

	changeVolume(event: Event) {
		const audio = this.audioRef.nativeElement;
		const value = (event.target as HTMLInputElement).value;
		this.volume = parseFloat(value);
		audio.volume = this.volume;
		if (this.volume === 0) {
			this.isMuted = true;
			audio.muted = true;
		} else {
			this.isMuted = false;
			audio.muted = false;
			this.previousVolume = this.volume;
		}
	}

	toggleMute() {
		const audio = this.audioRef.nativeElement;
		if (!audio.muted && this.volume > 0) {
			this.previousVolume = this.volume;
			this.volume = 0;
			audio.volume = 0;
			audio.muted = true;
			this.isMuted = true;
		} else {
			this.volume = this.previousVolume > 0 ? this.previousVolume : 1;
			audio.volume = this.volume;
			audio.muted = false;
			this.isMuted = false;
		}
	}

	get volumeIcon(): string {
		if (this.isMuted || this.volume === 0) return 'volume_off';
		if (this.volume < 0.5) return 'volume_down';
		return 'volume_up';
	}
}
