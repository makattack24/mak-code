import { DataSubject } from '../models/data.models';

export const ASTRONOMY: DataSubject = {
	id: 'astronomy',
	name: 'Astronomy',
	icon: 'fa-solid fa-meteor',
	color: '#6366f1',
	description: 'Explore the cosmos — planets, stars, and the structure of the universe.',
	datasets: [
		// ── 1. Key Facts ─────────────────────────────────
		{
			id: 'astro-facts',
			title: 'Key Space Facts',
			type: 'stat-cards',
			stats: [
				{ label: 'Age of Universe', value: '13.8 B yrs', icon: 'fa-solid fa-clock', color: '#818cf8' },
				{ label: 'Stars in Milky Way', value: '~200 B', icon: 'fa-solid fa-star', color: '#fbbf24' },
				{ label: 'Nearest Star', value: '4.24 ly', icon: 'fa-solid fa-sun', color: '#f97316' },
				{ label: 'Speed of Light', value: '299,792 km/s', icon: 'fa-solid fa-bolt', color: '#38bdf8' },
				{ label: 'Planets in Solar System', value: '8', icon: 'fa-solid fa-earth-americas', color: '#34d399' },
				{ label: 'Known Exoplanets', value: '5,700+', icon: 'fa-solid fa-globe', color: '#a78bfa' },
			],
		},

		// ── 2. Planets Table ─────────────────────────────
		{
			id: 'astro-planets',
			title: 'Solar System Planets',
			description: 'Physical and orbital data for all eight planets.',
			type: 'table',
			columns: [
				{ key: 'name', label: 'Planet' },
				{ key: 'type', label: 'Type' },
				{ key: 'diameter', label: 'Diameter (km)', align: 'right' },
				{ key: 'distance', label: 'Distance (AU)', align: 'right' },
				{ key: 'orbitalPeriod', label: 'Orbital Period', align: 'right' },
				{ key: 'moons', label: 'Moons', align: 'center' },
				{ key: 'hasRings', label: 'Rings', align: 'center' },
			],
			rows: [
				{ name: 'Mercury', type: 'Terrestrial', diameter: 4879, distance: 0.39, orbitalPeriod: '88 days', moons: 0, hasRings: '—' },
				{ name: 'Venus', type: 'Terrestrial', diameter: 12104, distance: 0.72, orbitalPeriod: '225 days', moons: 0, hasRings: '—' },
				{ name: 'Earth', type: 'Terrestrial', diameter: 12756, distance: 1.0, orbitalPeriod: '365 days', moons: 1, hasRings: '—' },
				{ name: 'Mars', type: 'Terrestrial', diameter: 6792, distance: 1.52, orbitalPeriod: '687 days', moons: 2, hasRings: '—' },
				{ name: 'Jupiter', type: 'Gas Giant', diameter: 142984, distance: 5.2, orbitalPeriod: '11.9 years', moons: 95, hasRings: '✓' },
				{ name: 'Saturn', type: 'Gas Giant', diameter: 120536, distance: 9.54, orbitalPeriod: '29.5 years', moons: 146, hasRings: '✓' },
				{ name: 'Uranus', type: 'Ice Giant', diameter: 51118, distance: 19.2, orbitalPeriod: '84 years', moons: 28, hasRings: '✓' },
				{ name: 'Neptune', type: 'Ice Giant', diameter: 49528, distance: 30.06, orbitalPeriod: '165 years', moons: 16, hasRings: '✓' },
			],
		},

		// ── 3. Planet Diameter Bar Chart ──────────────────
		{
			id: 'astro-diameters',
			title: 'Planet Diameters Compared',
			description: 'Equatorial diameter in kilometres.',
			type: 'bar-chart',
			unit: 'km',
			chartData: [
				{ label: 'Mercury', value: 4879, color: '#94a3b8' },
				{ label: 'Venus', value: 12104, color: '#f59e0b' },
				{ label: 'Earth', value: 12756, color: '#3b82f6' },
				{ label: 'Mars', value: 6792, color: '#ef4444' },
				{ label: 'Jupiter', value: 142984, color: '#d97706' },
				{ label: 'Saturn', value: 120536, color: '#eab308' },
				{ label: 'Uranus', value: 51118, color: '#06b6d4' },
				{ label: 'Neptune', value: 49528, color: '#4f46e5' },
			],
		},

		// ── 4. Universe Composition Pie Chart ────────────
		{
			id: 'astro-composition',
			title: 'Composition of the Universe',
			description: 'What the universe is made of by energy density.',
			type: 'pie-chart',
			chartData: [
				{ label: 'Dark Energy', value: 68, color: '#6366f1' },
				{ label: 'Dark Matter', value: 27, color: '#818cf8' },
				{ label: 'Ordinary Matter', value: 5, color: '#38bdf8' },
			],
		},
	],
};
