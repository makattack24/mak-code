import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss'
})
export class ClockComponent implements OnInit, OnDestroy {
  time: string = '';
  private timer: any;

  timezones = [
    { label: 'Local', zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { label: 'UTC', zone: 'UTC' },
    { label: 'New York', zone: 'America/New_York' },
    { label: 'London', zone: 'Europe/London' },
    { label: 'Tokyo', zone: 'Asia/Tokyo' }
  ];

  times: { label: string, time: string, zone: string }[] = [];
  showOtherTimes = false;

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  toggleOtherTimes() {
    this.showOtherTimes = !this.showOtherTimes;
  }

  private updateTime() {
    const now = new Date();
    this.time = now.toLocaleTimeString();
    this.times = this.timezones.map(tz => ({
      label: tz.label,
      time: now.toLocaleTimeString('en-US', { timeZone: tz.zone }),
      zone: tz.zone
    }));
  }
}