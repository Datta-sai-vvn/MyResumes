const OpenAI = require('openai');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
    // Handle OPTIONS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { systemPrompt, jobDescription, apiKey } = JSON.parse(event.body);

        // Effective API Key: User provided OR Env var
        const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

        if (!effectiveApiKey) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Missing OpenAI API Key' })
            };
        }

        const openai = new OpenAI({
            apiKey: effectiveApiKey,
        });

        // Construct the prompt
        // We ask for structured output to make parsing easier
        const userMessage = `
JOB DESCRIPTION:
${jobDescription}

Please generate the following LaTeX sections based on the above Job Description and the System Instructions.
Return the output as a JSON object with keys: "skills", "projects", "summary" (optional).
The values should be the raw LaTeX code for those sections (items only, or section content, excluding the \\section command itself if the template handles it, but let's assume valid LaTeX inner content).
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // or gpt-4o
            messages: [
                { role: "system", content: systemPrompt || "You are a helpful expert resume writer." },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" } // Enforce JSON for easier parsing
        });

        const content = completion.choices[0].message.content;
        let parsedContent;

        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse GPT JSON", e);
            // Fallback: try to extract manually if strict JSON mode failed or wasn't used
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to parse AI response' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: parsedContent
            })
        };

    } catch (error) {
        console.error('OpenAI Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
