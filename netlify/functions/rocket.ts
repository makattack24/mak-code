import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    const { platform, username } = event.queryStringParameters || {};
    const apiKey = process.env['TRACKER_API_KEY'];

    console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
    console.log('API Key length:', apiKey?.length || 0);
    console.log('Platform:', platform, 'Username:', username);

    // ...existing code...
    const url = `https://public-api.tracker.gg/v2/rocket-league/standard/profile/${platform}/${username}`;

    try {
        const response = await fetch(url, {
            headers: {
                'TRN-Api-Key': apiKey || '',
                'User-Agent': 'YourApp/1.0',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: `API Error: ${response.status} - ${errorText}` }),
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
        };
    } catch (err: any) {
        console.error('Function Error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
};

export { handler };