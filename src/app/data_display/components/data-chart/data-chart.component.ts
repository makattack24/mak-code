import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDataPoint } from '../../models/data.models';

@Component({
	selector: 'app-data-chart',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './data-chart.component.html',
	styleUrls: ['./data-chart.component.scss'],
})
export class DataChartComponent implements OnChanges {
	@Input() type: 'bar' | 'pie' = 'bar';
	@Input() data: ChartDataPoint[] = [];
	@Input() unit = '';

	maxValue = 0;
	total = 0;
	pieSlices: { color: string; start: number; end: number; label: string; value: number; pct: string; midAngle: number }[] = [];

	ngOnChanges(): void {
		this.maxValue = Math.max(...this.data.map(d => d.value), 1);
		this.total = this.data.reduce((s, d) => s + d.value, 0);

		if (this.type === 'pie') {
			this.buildPieSlices();
		}
	}

	barHeight(value: number): number {
		return (value / this.maxValue) * 100;
	}

	formatValue(value: number): string {
		if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
		if (value >= 10_000) return (value / 1_000).toFixed(1) + 'K';
		return value.toLocaleString();
	}

	/** Build conic-gradient slices for the pie chart. */
	private buildPieSlices(): void {
		let cumulative = 0;
		this.pieSlices = this.data.map(d => {
			const pct = (d.value / this.total) * 100;
			const start = cumulative;
			cumulative += pct;
			const end = cumulative;
			const midAngle = ((start + end) / 2 / 100) * 360;
			return {
				color: d.color || '#6366f1',
				start,
				end,
				label: d.label,
				value: d.value,
				pct: pct.toFixed(1),
				midAngle,
			};
		});
	}

	get conicGradient(): string {
		const stops = this.pieSlices
			.map(s => `${s.color} ${s.start}% ${s.end}%`)
			.join(', ');
		return `conic-gradient(${stops})`;
	}
}
