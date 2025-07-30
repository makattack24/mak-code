import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

const sql = neon();

const handler: Handler = async (event, context) => {
	try {
		const result = await sql`SELECT * FROM Users ORDER BY id ASC`;
		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to fetch users' }),
		};
	}
};

export { handler };
