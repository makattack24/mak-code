import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../../models/data.models';

@Component({
	selector: 'app-stat-cards',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './stat-cards.component.html',
	styleUrls: ['./stat-cards.component.scss'],
})
export class StatCardsComponent {
	@Input() stats: StatCard[] = [];
}
