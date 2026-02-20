import {
	Component,
	ElementRef,
	ViewChild,
	AfterViewInit,
	NgZone,
	ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';

@Component({
	selector: 'app-sound',
	standalone: true,
	imports: [FormsModule, DatePipe, NgIf],
	templateUrl: './sound.component.html',
	styleUrl: './sound.component.scss',
})
export class SoundComponent implements AfterViewInit {
	@ViewChild('waveCanvas', { static: false })
	canvasRef!: ElementRef<HTMLCanvasElement>;
	@ViewChild('audioRef', { static: false })
	audioRef!: ElementRef<HTMLAudioElement>;

	isPlaying = false;
	isMuted = false;
	duration = 0;
	currentTime = 0;
	volume = 1;
	private previousVolume = 1;
	private audioCtx!: AudioContext;
	private analyser!: AnalyserNode;
	private sourceCreated = false;

	constructor(
		private ngZone: NgZone,
		private cdr: ChangeDetectorRef
	) {}

	ngAfterViewInit() {
		const canvas = this.canvasRef.nativeElement;
		const audio = this.audioRef.nativeElement;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('Unable to get 2D context');
			return;
		}

		audio.addEventListener('play', () => {
			if (!this.sourceCreated) {
				const source = this.audioCtx.createMediaElementSource(audio);
				source.connect(this.analyser);
				this.analyser.connect(this.audioCtx.destination);
				this.sourceCreated = true;
			}

			this.analyser.fftSize = 1024;
			const bufferLength = this.analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);

			const draw = () => {
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				this.analyser.getByteTimeDomainData(dataArray);

				ctx.lineWidth = 2;
				ctx.strokeStyle = '#2563eb';
				ctx.beginPath();

				const sliceWidth = canvas.width / bufferLength;
				let x = 0;
				for (let i = 0; i < bufferLength; i++) {
					const v = dataArray[i] / 128.0;
					const y = (v * canvas.height) / 2;
					if (i === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
					x += sliceWidth;
				}
				ctx.lineTo(canvas.width, canvas.height / 2);
				ctx.stroke();

				if (!audio.paused) {
					requestAnimationFrame(draw);
				}
			};
			draw();
		});

		// Custom player events — run inside NgZone so change detection picks up updates
		this.ngZone.run(() => {
			audio.addEventListener('loadedmetadata', () => {
				this.ngZone.run(() => {
					audio.currentTime = 0;
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
				this.ngZone.run(() => {
					this.isPlaying = false;
				});
			});
			audio.addEventListener('error', () => {
				console.error('Audio load error:', audio.error);
			});
		});
		audio.volume = this.volume;
	}

	togglePlay() {
		const audio = this.audioRef.nativeElement;

		// Create AudioContext on first user gesture so it starts in 'running' state
		if (!this.audioCtx) {
			this.audioCtx = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			this.analyser = this.audioCtx.createAnalyser();
		}

		// Resume from user gesture context — browsers require this
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume();
		}

		if (audio.paused) {
			audio.play().catch((err) => console.error('Play failed:', err));
			this.isPlaying = true;
		} else {
			audio.pause();
			this.isPlaying = false;
		}
	}

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
			this.previousVolume = this.volume; // Remember last non-zero volume
		}
	}

	toggleMute() {
		const audio = this.audioRef.nativeElement;
		if (!audio.muted && this.volume > 0) {
			// Muting: remember current volume, set to 0
			this.previousVolume = this.volume;
			this.volume = 0;
			audio.volume = 0;
			audio.muted = true;
			this.isMuted = true;
		} else {
			// Unmuting: restore previous volume
			this.volume = this.previousVolume > 0 ? this.previousVolume : 1;
			audio.volume = this.volume;
			audio.muted = false;
			this.isMuted = false;
		}
	}
}
