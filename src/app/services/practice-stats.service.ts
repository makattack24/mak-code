import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

export interface OverallStats {
	total_attempts: number;
	total_passed: number;
	problems_attempted: number;
	problems_solved: number;
}

export interface ProblemStats {
	problem_id: number;
	attempts: number;
	passes: number;
	solved: boolean;
	last_attempt: string;
}

export interface RecentAttempt {
	problem_id: number;
	passed: boolean;
	attempted_at: string;
	code?: string;
}

export interface UserPracticeStats {
	overall: OverallStats;
	perProblem: ProblemStats[];
	recent: RecentAttempt[];
}

@Injectable({ providedIn: 'root' })
export class PracticeStatsService {
	private readonly API = '/.netlify/functions/practice-stats';

	private statsSubject = new BehaviorSubject<UserPracticeStats | null>(null);
	stats$ = this.statsSubject.asObservable();

	constructor(private http: HttpClient) {}

	/** Fetch all stats for a user. */
	loadStats(userId: number): Observable<UserPracticeStats | null> {
		return this.http.get<UserPracticeStats>(`${this.API}?user_id=${userId}`).pipe(
			tap((stats) => this.statsSubject.next(stats)),
			catchError((err) => {
				console.error('Failed to load practice stats:', err);
				return of(null);
			})
		);
	}

	/** Record an attempt and refresh stats. */
	recordAttempt(userId: number, problemId: number, passed: boolean, code?: string): Observable<any> {
		return this.http
			.post(this.API, { user_id: userId, problem_id: problemId, passed, code: code || '' })
			.pipe(
				tap(() => {
					// Refresh stats in the background after recording
					this.loadStats(userId).subscribe();
				}),
				catchError((err) => {
					console.error('Failed to record attempt:', err);
					return of(null);
				})
			);
	}

	/** Get cached stats snapshot. */
	get currentStats(): UserPracticeStats | null {
		return this.statsSubject.value;
	}

	/** Check if a problem is solved from cached stats. */
	isProblemSolved(problemId: number): boolean {
		const stats = this.currentStats;
		if (!stats) return false;
		return stats.perProblem.some((p) => p.problem_id === problemId && p.solved);
	}

	/** Get stats for a specific problem from cache. */
	getProblemStats(problemId: number): ProblemStats | undefined {
		return this.currentStats?.perProblem.find((p) => p.problem_id === problemId);
	}

	/** Clear cached stats (e.g., on logout). */
	clearStats(): void {
		this.statsSubject.next(null);
	}
}
