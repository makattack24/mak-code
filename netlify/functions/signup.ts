import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';

const sql = neon();

export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method not allowed' };
	}

	const { name, email, password } = JSON.parse(event.body || '{}');

	if (!name || !email || !password) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Name, email, and password are required.' }),
		};
	}

	// Basic validation
	if (password.length < 6) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Password must be at least 6 characters.' }),
		};
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Invalid email address.' }),
		};
	}

	try {
		// Check for existing user
		const existing = await sql`SELECT id FROM Users WHERE email = ${email}`;
		if (existing.length > 0) {
			return {
				statusCode: 409,
				body: JSON.stringify({ error: 'An account with this email already exists.' }),
			};
		}

		const password_hash = await bcrypt.hash(password, 10);

		const newUser = await sql`
			INSERT INTO Users (name, email, role, isactive, password_hash)
			VALUES (${name}, ${email}, 'user', true, ${password_hash})
			RETURNING id, name, email, role, avatar_url
		`;

		return {
			statusCode: 201,
			body: JSON.stringify(newUser[0]),
		};
	} catch (error) {
		console.error('Signup error:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Server error. Please try again later.' }),
		};
	}
};
