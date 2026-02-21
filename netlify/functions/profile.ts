import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';

const sql = neon();

export const handler: Handler = async (event) => {
	const { httpMethod, body, queryStringParameters } = event;

	// GET — fetch user profile by id
	if (httpMethod === 'GET') {
		const id = queryStringParameters?.['id'];
		if (!id) {
			return { statusCode: 400, body: JSON.stringify({ error: 'User ID is required.' }) };
		}
		try {
			const rows = await sql`SELECT id, name, email, role, avatar_url FROM Users WHERE id = ${id}`;
			if (!rows[0]) {
				return { statusCode: 404, body: JSON.stringify({ error: 'User not found.' }) };
			}
			return { statusCode: 200, body: JSON.stringify(rows[0]) };
		} catch {
			return { statusCode: 500, body: JSON.stringify({ error: 'Server error.' }) };
		}
	}

	// PUT — update profile
	if (httpMethod === 'PUT') {
		const parsed = JSON.parse(body || '{}');
		const { id, name, email, currentPassword, newPassword, avatar_url } = parsed;

		if (!id) {
			return { statusCode: 400, body: JSON.stringify({ error: 'User ID is required.' }) };
		}

		try {
			// Fetch the existing user
			const rows = await sql`SELECT id, name, email, role, password_hash, avatar_url FROM Users WHERE id = ${id}`;
			if (!rows[0]) {
				return { statusCode: 404, body: JSON.stringify({ error: 'User not found.' }) };
			}
			const user = rows[0];

			// If changing email, check uniqueness
			if (email && email !== user['email']) {
				const existing = await sql`SELECT id FROM Users WHERE email = ${email} AND id != ${id}`;
				if (existing.length > 0) {
					return {
						statusCode: 409,
						body: JSON.stringify({ error: 'Email is already taken by another account.' }),
					};
				}
			}

			// If setting a new password, verify current password
			if (newPassword) {
				if (!currentPassword) {
					return {
						statusCode: 400,
						body: JSON.stringify({ error: 'Current password is required to set a new password.' }),
					};
				}
				const valid = await bcrypt.compare(currentPassword, user['password_hash'] as string);
				if (!valid) {
					return {
						statusCode: 401,
						body: JSON.stringify({ error: 'Current password is incorrect.' }),
					};
				}
				if (newPassword.length < 6) {
					return {
						statusCode: 400,
						body: JSON.stringify({ error: 'New password must be at least 6 characters.' }),
					};
				}
			}

			const finalName = name ?? user['name'];
			const finalEmail = email ?? user['email'];
			const finalAvatar = avatar_url !== undefined ? avatar_url : user['avatar_url'];

			let updated;
			if (newPassword) {
				const newHash = await bcrypt.hash(newPassword, 10);
				updated = await sql`
					UPDATE Users
					SET name = ${finalName}, email = ${finalEmail}, avatar_url = ${finalAvatar}, password_hash = ${newHash}
					WHERE id = ${id}
					RETURNING id, name, email, role, avatar_url
				`;
			} else {
				updated = await sql`
					UPDATE Users
					SET name = ${finalName}, email = ${finalEmail}, avatar_url = ${finalAvatar}
					WHERE id = ${id}
					RETURNING id, name, email, role, avatar_url
				`;
			}

			return { statusCode: 200, body: JSON.stringify(updated[0]) };
		} catch (error) {
			console.error('Profile update error:', error);
			return { statusCode: 500, body: JSON.stringify({ error: 'Server error.' }) };
		}
	}

	return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed.' }) };
};
