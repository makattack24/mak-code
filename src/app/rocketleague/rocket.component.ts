import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RocketLeagueService } from '../services/rocket.service';

@Component({
	selector: 'app-rocket-stats',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="card" *ngIf="stats">
			<h2>{{ stats?.data?.platformInfo?.platformUserHandle }}</h2>
			<p>Wins: {{ getStat('wins') }}</p>
			<p>Goals: {{ getStat('goals') }}</p>
			<p>Saves: {{ getStat('saves') }}</p>
		</div>

		<input [(ngModel)]="username" placeholder="Enter username" />
		<select [(ngModel)]="platform">
			<option value="epic">Epic</option>
			<option value="steam">Steam</option>
			<option value="psn">PlayStation</option>
			<option value="xbl">Xbox</option>
		</select>
		<button (click)="fetchStats()">Fetch Stats</button>
	`,
})
export class RocketStatsComponent {
	username = '';
	platform = 'epic';
	stats: any;

	constructor(private rlService: RocketLeagueService) {}

	fetchStats() {
		this.rlService.getStats(this.platform, this.username).subscribe({
			next: (data) => (this.stats = data),
			error: (err) => console.error(err),
		});
	}

	getStat(statName: string) {
		return (
			this.stats?.data?.segments?.[0]?.stats?.[statName]?.value ?? 'N/A'
		);
	}
}
