import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

const sql = neon();

const handler: Handler = async (event, context) => {
    const { httpMethod, body, queryStringParameters } = event;

    try {
        switch (httpMethod) {
            case 'GET':
                // Get all users
                const users = await sql`SELECT * FROM Users ORDER BY id ASC`;
                return {
                    statusCode: 200,
                    body: JSON.stringify(users),
                };

            case 'POST':
                // Add new user
                const { name, email, role } = JSON.parse(body || '{}');
                
                if (!name || !email) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Name and email are required' }),
                    };
                }

                const newUser = await sql`
                    INSERT INTO Users (name, email, role) 
                    VALUES (${name}, ${email}, ${role || 'user'}) 
                    RETURNING *
                `;

                return {
                    statusCode: 201,
                    body: JSON.stringify(newUser[0]),
                };

            case 'DELETE':
                // Delete user by ID
                const userId = queryStringParameters?.['id'];
                
                if (!userId) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'User ID is required' }),
                    };
                }

                await sql`DELETE FROM Users WHERE id = ${userId}`;
                
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'User deleted successfully' }),
                };

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: 'Method not allowed' }),
                };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database operation failed' }),
        };
    }
};

export { handler };