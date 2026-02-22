import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../models/data.models';

@Component({
	selector: 'app-data-table',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
	@Input() columns: TableColumn[] = [];
	@Input() rows: Record<string, any>[] = [];
	@Input() sortable = true;

	sortKey = '';
	sortDirection: 'asc' | 'desc' = 'asc';

	get sortedRows(): Record<string, any>[] {
		if (!this.sortKey) return this.rows;
		const dir = this.sortDirection === 'asc' ? 1 : -1;
		return [...this.rows].sort((a, b) => {
			const va = a[this.sortKey];
			const vb = b[this.sortKey];
			if (typeof va === 'number' && typeof vb === 'number') {
				return (va - vb) * dir;
			}
			return String(va).localeCompare(String(vb)) * dir;
		});
	}

	toggleSort(key: string): void {
		if (!this.sortable) return;
		if (this.sortKey === key) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortKey = key;
			this.sortDirection = 'asc';
		}
	}

	formatCell(col: TableColumn, row: Record<string, any>): string {
		const val = row[col.key];
		if (col.format) return col.format(val);
		if (typeof val === 'number') return val.toLocaleString();
		return val ?? '';
	}
}
