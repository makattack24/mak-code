import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

const sql = neon();

/**
 * practice-stats function
 *
 * POST   — Record an attempt   { user_id, problem_id, passed }
 * GET    — Fetch stats          ?user_id=123
 *
 * The table `practice_attempts` must exist:
 *   CREATE TABLE practice_attempts (
 *     id           SERIAL PRIMARY KEY,
 *     user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *     problem_id   INTEGER NOT NULL,
 *     passed       BOOLEAN NOT NULL DEFAULT false,
 *     attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *   );
 *   CREATE INDEX idx_attempts_user ON practice_attempts(user_id);
 */
export const handler: Handler = async (event) => {
	const { httpMethod, body, queryStringParameters } = event;

	const headers = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};

	// Handle preflight
	if (httpMethod === 'OPTIONS') {
		return { statusCode: 204, headers, body: '' };
	}

	try {
		// ── POST: Record an attempt ──────────────────────────
		if (httpMethod === 'POST') {
			const { user_id, problem_id, passed } = JSON.parse(body || '{}');

			if (!user_id || !problem_id) {
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({ error: 'user_id and problem_id are required' }),
				};
			}

			const row = await sql`
				INSERT INTO practice_attempts (user_id, problem_id, passed)
				VALUES (${user_id}, ${problem_id}, ${!!passed})
				RETURNING *
			`;

			return {
				statusCode: 201,
				headers,
				body: JSON.stringify(row[0]),
			};
		}

		// ── GET: Retrieve stats ─────────────────────────────
		if (httpMethod === 'GET') {
			const userId = queryStringParameters?.['user_id'];
			if (!userId) {
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({ error: 'user_id query param is required' }),
				};
			}

			// Overall stats
			const overall = await sql`
				SELECT
					COUNT(*)::int                                      AS total_attempts,
					COUNT(*) FILTER (WHERE passed)::int                AS total_passed,
					COUNT(DISTINCT problem_id)::int                    AS problems_attempted,
					COUNT(DISTINCT problem_id) FILTER (WHERE passed)::int AS problems_solved
				FROM practice_attempts
				WHERE user_id = ${userId}
			`;

			// Per-problem breakdown
			const perProblem = await sql`
				SELECT
					problem_id,
					COUNT(*)::int                        AS attempts,
					COUNT(*) FILTER (WHERE passed)::int  AS passes,
					bool_or(passed)                      AS solved,
					MAX(attempted_at)                    AS last_attempt
				FROM practice_attempts
				WHERE user_id = ${userId}
				GROUP BY problem_id
				ORDER BY problem_id
			`;

			// Recent activity (last 20)
			const recent = await sql`
				SELECT problem_id, passed, attempted_at
				FROM practice_attempts
				WHERE user_id = ${userId}
				ORDER BY attempted_at DESC
				LIMIT 20
			`;

			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({
					overall: overall[0],
					perProblem,
					recent,
				}),
			};
		}

		return {
			statusCode: 405,
			headers,
			body: JSON.stringify({ error: 'Method not allowed' }),
		};
	} catch (error) {
		console.error('practice-stats error:', error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: 'Database operation failed' }),
		};
	}
};
