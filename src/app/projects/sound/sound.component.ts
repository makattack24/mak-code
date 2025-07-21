import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sound',
  standalone: true,
  templateUrl: './sound.component.html',
  styleUrl: './sound.component.scss'
})
export class SoundComponent implements AfterViewInit {
  @ViewChild('waveCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audioRef', { static: false }) audioRef!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const audio = this.audioRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context');
      return;
    }
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();

    let sourceCreated = false;

    audio.addEventListener('play', () => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!sourceCreated) {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        sourceCreated = true;
      }

      analyser.fftSize = 1024;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        // Ensure canvas size is correct
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#2563eb';
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 2;
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
  }
}