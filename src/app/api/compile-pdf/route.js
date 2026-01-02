import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const { latex } = await request.json();

        if (!latex) {
            return NextResponse.json({ error: 'Missing LaTeX content' }, { status: 400 });
        }

        // Simplest, most reliable method for latexonline.cc is often just a direct URL construction
        // or a simple POST with url-encoded body.
        // Let's try constructing the URL with the 'text' parameter.

        // Note: latexonline.cc takes ?text=... 

        const response = await axios.get(
            `https://latexonline.cc/compile`,
            {
                params: {
                    text: latex,
                    force: 'true'
                },
                responseType: 'arraybuffer',
                timeout: 30000
            }
        );

        const pdfBase64 = Buffer.from(response.data, 'binary').toString('base64');

        return NextResponse.json({
            success: true,
            pdf: pdfBase64
        });

    } catch (error) {
        console.error('LaTeX Compilation Error:', error.message);

        // Return a clean error so the UI can show the "Download .tex" option
        return NextResponse.json(
            { error: 'Compilation failed', details: error.message },
            { status: 500 }
        );
    }
}
