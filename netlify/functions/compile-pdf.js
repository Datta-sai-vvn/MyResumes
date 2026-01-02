const axios = require('axios');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { latex } = JSON.parse(event.body);

        if (!latex) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing LaTeX content' })
            };
        }

        // Use LaTeX.Online service
        // It accepts a POST request with 'text' parameter containing latex code
        // Returns a PDF stream
        const response = await axios.post('https://latex.online/compile', null, {
            params: {
                text: latex,
                command: 'pdflatex' // or xelatex if needed
            },
            responseType: 'arraybuffer'
        });

        // Convert buffer to base64 to send back to client
        const pdfBase64 = Buffer.from(response.data, 'binary').toString('base64');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pdf: pdfBase64
            })
        };

    } catch (error) {
        console.error('Compilation Error:', error);

        let errorMessage = 'Compilation failed';
        if (error.response && error.response.data) {
            // Try to read buffer as string to see latex log error
            errorMessage = Buffer.from(error.response.data).toString('utf8');
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: errorMessage,
                details: error.message
            })
        };
    }
};
