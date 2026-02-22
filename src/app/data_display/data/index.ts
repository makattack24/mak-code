import { DataSubject } from '../models/data.models';
import { ASTRONOMY } from './astronomy.data';
import { ROCKET_LEAGUE } from './rocket-league.data';
import { POKEMON } from './pokemon.data';

/** Master registry — add new subjects here. */
export const ALL_SUBJECTS: DataSubject[] = [
	ASTRONOMY,
	ROCKET_LEAGUE,
	POKEMON,
];
