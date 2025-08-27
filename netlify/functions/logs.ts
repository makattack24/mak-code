import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

const sql = neon();

const handler: Handler = async (event, context) => {
	const visitorInfo = {
		ip: event.headers['x-forwarded-for'] || 'unknown',
		ua: event.headers['user-agent'] || 'unknown',
		time: new Date().toISOString(),
	};

	try {
		// --- 1) Insert visit into Neon DB ---
		await sql`
			INSERT INTO visits (ip, user_agent, visited_at)
			VALUES (${visitorInfo.ip}, ${visitorInfo.ua}, ${visitorInfo.time})
		`;

		// --- 2) Send Discord notification ---
		await fetch(
			'https://discord.com/api/webhooks/1410048420365996162/qnkPPE5g3RTw6T0Rjp0EeYe1_qZ5h7sKjmgEhzYgSWLv0Wm0OSwlz7EWvjB1uLmhK00_',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: `👋 New visitor!\nIP: ${visitorInfo.ip}\nUA: ${visitorInfo.ua}\nTime: ${visitorInfo.time}`,
				}),
			}
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Visit logged to Neon DB & Discord notification sent',
			}),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to log visit' }),
		};
	}
};

export { handler };
