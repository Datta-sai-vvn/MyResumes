import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const body = await request.json();
        const { systemPrompt, jobDescription, apiKey } = body;

        // Effective API Key: User provided OR Env var
        const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

        if (!effectiveApiKey) {
            return NextResponse.json(
                { error: 'Missing OpenAI API Key' },
                { status: 401 }
            );
        }

        const openai = new OpenAI({
            apiKey: effectiveApiKey,
        });

        // Construct the prompt
        const userMessage = `
JOB DESCRIPTION:
${jobDescription}

Please generate the following LaTeX sections based on the above Job Description and the System Instructions.
Return the output as a JSON object with keys: "skills", "projects", "summary" (optional).
The values should be the raw LaTeX code for those sections (items only, or section content, excluding the \\section command itself if the template handles it).
Do not include markdown formatting like \`\`\`json. Just return raw JSON.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt || "You are a helpful expert resume writer." },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        let parsedContent;

        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse GPT JSON", e);
            return NextResponse.json(
                { error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: parsedContent
        });

    } catch (error) {
        console.error('OpenAI Error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
