import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: 'Method not allowed' }),
		};
	}

	const webhookUrl = process.env['DISCORD_CONTACT_WEBHOOK_URL'] as string;

	if (!webhookUrl) {
		throw new Error(
			'DISCORD_CONTACT_WEBHOOK_URL is not defined in environment variables'
		);
	}

	try {
		const { name, email, message } = JSON.parse(event.body || '{}');

		if (!name || !email || !message) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'Missing required fields: name, email, message' }),
			};
		}

		const time = new Date().toISOString();

		await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				content: `📩 **New Contact Message!**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}\n**Time:** ${time}`,
			}),
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Contact message sent to Discord' }),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to send contact message' }),
		};
	}
};

export { handler };
