import { DataSubject } from '../models/data.models';

export const ROCKET_LEAGUE: DataSubject = {
	id: 'rocket-league',
	name: 'Rocket League',
	icon: 'fa-solid fa-car',
	color: '#0ea5e9',
	description: 'Stats, ranks, and car data from the world of supersonic acrobatic rocket-powered battle cars.',
	datasets: [
		// ── 1. Quick Facts ───────────────────────────────
		{
			id: 'rl-facts',
			title: 'Quick Facts',
			type: 'stat-cards',
			stats: [
				{ label: 'Max Ball Speed', value: '136 km/h', icon: 'fa-solid fa-gauge-high', color: '#f97316' },
				{ label: 'Max Car Speed', value: '82.8 km/h', icon: 'fa-solid fa-car-side', color: '#0ea5e9' },
				{ label: 'Boost Capacity', value: 100, icon: 'fa-solid fa-fire', color: '#eab308' },
				{ label: 'Field Length', value: '4096 uu', icon: 'fa-solid fa-ruler', color: '#22c55e' },
				{ label: 'Release Year', value: 2015, icon: 'fa-solid fa-calendar', color: '#a78bfa' },
				{ label: 'Max Players / Match', value: 8, icon: 'fa-solid fa-users', color: '#ec4899' },
			],
		},

		// ── 2. Rank Table ────────────────────────────────
		{
			id: 'rl-ranks',
			title: 'Competitive Ranks',
			description: 'Standard 3v3 rank tiers with approximate MMR ranges.',
			type: 'table',
			columns: [
				{ key: 'rank', label: 'Rank' },
				{ key: 'tier', label: 'Tier' },
				{ key: 'mmrLow', label: 'MMR Low', align: 'right' },
				{ key: 'mmrHigh', label: 'MMR High', align: 'right' },
				{ key: 'playerPct', label: 'Player %', align: 'right' },
			],
			rows: [
				{ rank: 'Bronze', tier: 'I – III', mmrLow: 0, mmrHigh: 195, playerPct: '~5%' },
				{ rank: 'Silver', tier: 'I – III', mmrLow: 196, mmrHigh: 375, playerPct: '~9%' },
				{ rank: 'Gold', tier: 'I – III', mmrLow: 376, mmrHigh: 555, playerPct: '~18%' },
				{ rank: 'Platinum', tier: 'I – III', mmrLow: 556, mmrHigh: 735, playerPct: '~23%' },
				{ rank: 'Diamond', tier: 'I – III', mmrLow: 736, mmrHigh: 915, playerPct: '~22%' },
				{ rank: 'Champion', tier: 'I – III', mmrLow: 916, mmrHigh: 1095, playerPct: '~15%' },
				{ rank: 'Grand Champion', tier: 'I – III', mmrLow: 1096, mmrHigh: 1435, playerPct: '~6%' },
				{ rank: 'Supersonic Legend', tier: '—', mmrLow: 1436, mmrHigh: 2700, playerPct: '~0.5%' },
			],
		},

		// ── 3. Hitbox Lengths ────────────────────────────
		{
			id: 'rl-hitboxes',
			title: 'Car Hitbox Lengths',
			description: 'Front-to-back hitbox length in Unreal Units.',
			type: 'bar-chart',
			unit: 'uu',
			chartData: [
				{ label: 'Octane', value: 118.01, color: '#3b82f6' },
				{ label: 'Dominus', value: 127.93, color: '#ef4444' },
				{ label: 'Breakout', value: 131.49, color: '#22c55e' },
				{ label: 'Plank', value: 128.82, color: '#f59e0b' },
				{ label: 'Hybrid', value: 127.02, color: '#a855f7' },
				{ label: 'Merc', value: 120.72, color: '#ec4899' },
			],
		},

		// ── 4. Rank Distribution Pie ─────────────────────
		{
			id: 'rl-distribution',
			title: 'Ranked Player Distribution',
			description: 'Approximate percentage of the player base in each rank tier.',
			type: 'pie-chart',
			chartData: [
				{ label: 'Bronze', value: 5, color: '#b45309' },
				{ label: 'Silver', value: 9, color: '#94a3b8' },
				{ label: 'Gold', value: 18, color: '#eab308' },
				{ label: 'Platinum', value: 23, color: '#06b6d4' },
				{ label: 'Diamond', value: 22, color: '#6366f1' },
				{ label: 'Champion', value: 15, color: '#a855f7' },
				{ label: 'GC+', value: 8, color: '#dc2626' },
			],
		},
	],
};
