import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';

const sql = neon();

export const handler: Handler = async (event) => {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) {
        return { statusCode: 400, body: 'Missing email or password' };
    }

    try {
        const users = await sql`SELECT id, email, password_hash FROM Users WHERE email = ${email}`;
        if (!users[0]) {
            return { statusCode: 401, body: 'Invalid credentials' };
        }
        const user = users[0];
        const valid = await bcrypt.compare(password, user['password_hash']);
        if (!valid) {
            return { statusCode: 401, body: 'Invalid credentials' };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ id: user['id'], email: user['email'] }),
        };
    } catch (err) {
        return { statusCode: 500, body: 'Server error' };
    }
};