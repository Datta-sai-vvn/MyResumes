import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const { systemPrompt, jobDescription, apiKey } = await request.json();

        // Effective API Key: User provided OR Env var
        const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

        if (!effectiveApiKey) {
            return NextResponse.json({ error: 'Missing OpenAI API Key' }, { status: 401 });
        }

        const openai = new OpenAI({
            apiKey: effectiveApiKey
        });

        // Optimized system prompt for section-only generation
        const optimizedPrompt = `${systemPrompt || "You are an expert resume writer."}

CRITICAL OUTPUT REQUIREMENTS:
1. Generate ONLY these three sections - nothing else
2. Do NOT include \\documentclass, \\begin{document}, \\end{document}
3. Do NOT include Education or Experience sections
4. Start directly with \\section*{Summary}
5. Each section must be complete and properly formatted
6. Follow all line length and formatting constraints exactly

OUTPUT FORMAT:
\`\`\`latex
\\section*{Summary}
[4-line summary with bold keywords]

\\section{Skills}
[5-8 skill category lines]

\\section{Projects}
[2 projects with 3 bullets each]
\`\`\``;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: optimizedPrompt },
                {
                    role: "user",
                    content: `Generate tailored resume sections for this job:\n\n${jobDescription}`
                }
            ],
            temperature: 0.7,
            max_tokens: 2500
        });

        let generatedText = completion.choices[0].message.content;

        // Remove markdown code fences if present
        generatedText = generatedText.replace(/```latex\n?/g, '').replace(/```\n?/g, '');

        // Extract individual sections using regex
        const summaryMatch = generatedText.match(/\\section\*?\{Summary\}([\s\S]*?)(?=\\section|$)/);
        const skillsMatch = generatedText.match(/\\section\{Skills\}([\s\S]*?)(?=\\section|$)/);
        const projectsMatch = generatedText.match(/\\section\{Projects\}([\s\S]*?)$/);

        if (!summaryMatch || !skillsMatch || !projectsMatch) {
            // Fallback: Return raw text if regex fails, let user edit
            return NextResponse.json({
                success: true,
                sections: {
                    summary: generatedText, // Just dump everything here if structure failed
                    skills: "",
                    projects: ""
                },
                warning: "Could not strictly parse sections. Check the output manually."
            });
        }

        return NextResponse.json({
            success: true,
            sections: {
                summary: `\\section*{Summary}${summaryMatch[1].trim()}`,
                skills: `\\section{Skills}${skillsMatch[1].trim()}`,
                projects: `\\section{Projects}${projectsMatch[1].trim()}`
            },
            raw: generatedText
        });

    } catch (error) {
        console.error('GPT Generation Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
