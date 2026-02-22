import { DataSubject } from '../models/data.models';

export const POKEMON: DataSubject = {
	id: 'pokemon',
	name: 'Pokémon',
	icon: 'fa-solid fa-dragon',
	color: '#ef4444',
	description: 'Base stats, type breakdowns, and fun facts from the world of Pokémon.',
	datasets: [
		// ── 1. Fun Facts ─────────────────────────────────
		{
			id: 'poke-facts',
			title: 'Pokémon Fun Facts',
			type: 'stat-cards',
			stats: [
				{ label: 'Total Pokémon', value: '1,025', icon: 'fa-solid fa-list-ol', color: '#ef4444' },
				{ label: 'Regions', value: 9, icon: 'fa-solid fa-map', color: '#3b82f6' },
				{ label: 'Types', value: 18, icon: 'fa-solid fa-shapes', color: '#22c55e' },
				{ label: 'Mega Evolutions', value: 48, icon: 'fa-solid fa-dna', color: '#a855f7' },
				{ label: 'Legendary Pokémon', value: 68, icon: 'fa-solid fa-crown', color: '#eab308' },
				{ label: 'Starter Pokémon', value: 27, icon: 'fa-solid fa-seedling', color: '#10b981' },
			],
		},

		// ── 2. Gen 1 Starters Stats ──────────────────────
		{
			id: 'poke-starters',
			title: 'Gen 1 Starter Final Evolutions',
			description: 'Base stats for the fully-evolved Kanto starters.',
			type: 'table',
			columns: [
				{ key: 'name', label: 'Pokémon' },
				{ key: 'type', label: 'Type' },
				{ key: 'hp', label: 'HP', align: 'center' },
				{ key: 'atk', label: 'Atk', align: 'center' },
				{ key: 'def', label: 'Def', align: 'center' },
				{ key: 'spAtk', label: 'Sp.Atk', align: 'center' },
				{ key: 'spDef', label: 'Sp.Def', align: 'center' },
				{ key: 'speed', label: 'Speed', align: 'center' },
				{ key: 'total', label: 'Total', align: 'center' },
			],
			rows: [
				{ name: 'Venusaur', type: 'Grass / Poison', hp: 80, atk: 82, def: 83, spAtk: 100, spDef: 100, speed: 80, total: 525 },
				{ name: 'Charizard', type: 'Fire / Flying', hp: 78, atk: 84, def: 78, spAtk: 109, spDef: 85, speed: 100, total: 534 },
				{ name: 'Blastoise', type: 'Water', hp: 79, atk: 83, def: 100, spAtk: 85, spDef: 105, speed: 78, total: 530 },
				{ name: 'Pikachu', type: 'Electric', hp: 35, atk: 55, def: 40, spAtk: 50, spDef: 50, speed: 90, total: 320 },
				{ name: 'Mewtwo', type: 'Psychic', hp: 106, atk: 110, def: 90, spAtk: 154, spDef: 90, speed: 130, total: 680 },
				{ name: 'Dragonite', type: 'Dragon / Flying', hp: 91, atk: 134, def: 95, spAtk: 100, spDef: 100, speed: 80, total: 600 },
				{ name: 'Gengar', type: 'Ghost / Poison', hp: 60, atk: 65, def: 60, spAtk: 130, spDef: 75, speed: 110, total: 500 },
				{ name: 'Snorlax', type: 'Normal', hp: 160, atk: 110, def: 65, spAtk: 65, spDef: 110, speed: 30, total: 540 },
			],
		},

		// ── 3. Pokémon per Generation ────────────────────
		{
			id: 'poke-per-gen',
			title: 'Pokémon Introduced per Generation',
			type: 'bar-chart',
			unit: '',
			chartData: [
				{ label: 'Gen I', value: 151, color: '#ef4444' },
				{ label: 'Gen II', value: 100, color: '#f97316' },
				{ label: 'Gen III', value: 135, color: '#22c55e' },
				{ label: 'Gen IV', value: 107, color: '#3b82f6' },
				{ label: 'Gen V', value: 156, color: '#6366f1' },
				{ label: 'Gen VI', value: 72, color: '#ec4899' },
				{ label: 'Gen VII', value: 88, color: '#eab308' },
				{ label: 'Gen VIII', value: 96, color: '#14b8a6' },
				{ label: 'Gen IX', value: 120, color: '#a855f7' },
			],
		},

		// ── 4. Gen 1 Type Distribution ───────────────────
		{
			id: 'poke-types',
			title: 'Gen 1 Type Distribution',
			description: 'Number of Gen 1 Pokémon per primary type.',
			type: 'pie-chart',
			chartData: [
				{ label: 'Water', value: 32, color: '#3b82f6' },
				{ label: 'Normal', value: 22, color: '#a1a1aa' },
				{ label: 'Poison', value: 33, color: '#a855f7' },
				{ label: 'Grass', value: 14, color: '#22c55e' },
				{ label: 'Fire', value: 12, color: '#ef4444' },
				{ label: 'Psychic', value: 14, color: '#ec4899' },
				{ label: 'Bug', value: 12, color: '#84cc16' },
				{ label: 'Other', value: 12, color: '#94a3b8' },
			],
		},
	],
};
