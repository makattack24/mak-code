import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataSubject, DataSet } from './models/data.models';
import { ALL_SUBJECTS } from './data';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataChartComponent } from './components/data-chart/data-chart.component';
import { StatCardsComponent } from './components/stat-cards/stat-cards.component';

@Component({
	selector: 'app-data-display',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		DataTableComponent,
		DataChartComponent,
		StatCardsComponent,
	],
	templateUrl: './data_display.component.html',
	styleUrls: ['./data_display.component.scss'],
})
export class DataDisplayComponent {
	subjects: DataSubject[] = ALL_SUBJECTS;
	selectedSubject: DataSubject | null = null;
	activeDatasetId: string | null = null;
	searchQuery = '';

	/** Filtered subjects based on search query. */
	get filteredSubjects(): DataSubject[] {
		if (!this.searchQuery.trim()) return this.subjects;
		const q = this.searchQuery.toLowerCase();
		return this.subjects.filter(
			s =>
				s.name.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q)
		);
	}

	/** Select a subject and default to the first dataset. */
	openSubject(subject: DataSubject): void {
		this.selectedSubject = subject;
		this.activeDatasetId = subject.datasets[0]?.id ?? null;
	}

	/** Go back to the subject grid. */
	closeSubject(): void {
		this.selectedSubject = null;
		this.activeDatasetId = null;
	}

	/** Switch the visible dataset within a subject. */
	selectDataset(ds: DataSet): void {
		this.activeDatasetId = ds.id;
	}

	/** Currently active dataset object. */
	get activeDataset(): DataSet | null {
		if (!this.selectedSubject || !this.activeDatasetId) return null;
		return this.selectedSubject.datasets.find(d => d.id === this.activeDatasetId) ?? null;
	}

	/** ESC key handler to close detail. */
	@HostListener('document:keydown.escape')
	onEscape(): void {
		if (this.selectedSubject) this.closeSubject();
	}
}