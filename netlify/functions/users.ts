import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

const sql = neon();

const handler: Handler = async (event, context) => {
    const { httpMethod, body, queryStringParameters } = event;

    try {
        switch (httpMethod) {
            case 'GET':
                const users = await sql`SELECT * FROM Users ORDER BY id ASC`;
                return {
                    statusCode: 200,
                    body: JSON.stringify(users),
                };

            case 'POST':
                const { name, email, role, isactive } = JSON.parse(body || '{}');
                if (!name || !email) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Name and email are required' }),
                    };
                }
                const newUser = await sql`
                    INSERT INTO Users (name, email, role, isactive)
                    VALUES (${name}, ${email}, ${role || 'user'}, ${isactive !== undefined ? isactive : true})
                    RETURNING *
                `;
                return {
                    statusCode: 201,
                    body: JSON.stringify(newUser[0]),
                };

            case 'PUT':
                // Update user by ID
                const updateId = queryStringParameters?.['id'];
                if (!updateId) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'User ID is required' }),
                    };
                }
                const updateData = JSON.parse(body || '{}');
                console.log('Update Data:', updateData);
                const { name: upName, email: upEmail, role: upRole, isactive: upIsActive } = updateData;
                const updated = await sql`
                    UPDATE Users
                    SET name = ${upName},
                        email = ${upEmail},
                        role = ${upRole},
                        isactive = ${upIsActive}
                    WHERE id = ${updateId}
                    RETURNING *
                `;
                if (!updated[0]) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'User not found' }),
                    };
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify(updated[0]),
                };

            case 'DELETE':
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