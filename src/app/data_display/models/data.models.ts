/** A single highlight stat shown as a card. */
export interface StatCard {
	label: string;
	value: string | number;
	icon?: string;          // Font Awesome class, e.g. 'fa-solid fa-star'
	color?: string;         // CSS color for the accent
}

/** Column definition for a data table. */
export interface TableColumn {
	key: string;            // property name in the row object
	label: string;          // display header
	align?: 'left' | 'center' | 'right';
	format?: (value: any) => string;   // optional formatter
}

/** A single labelled numeric value for charts. */
export interface ChartDataPoint {
	label: string;
	value: number;
	color?: string;
}

/** Describes one visualisation block inside a subject. */
export interface DataSet {
	id: string;
	title: string;
	description?: string;
	type: 'table' | 'bar-chart' | 'pie-chart' | 'stat-cards' | 'number-list';

	// table-specific
	columns?: TableColumn[];
	rows?: Record<string, any>[];

	// chart-specific
	chartData?: ChartDataPoint[];
	unit?: string;

	// stat-cards-specific
	stats?: StatCard[];
}

/** A top-level topic / subject containing multiple data sets. */
export interface DataSubject {
	id: string;
	name: string;
	icon: string;           // Font Awesome class
	color: string;          // accent / brand color
	description: string;
	datasets: DataSet[];
}
