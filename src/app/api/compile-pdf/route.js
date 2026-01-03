import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const { latex, forceOnePage } = await request.json();

        if (!latex) {
            return NextResponse.json({ error: 'Missing LaTeX content' }, { status: 400 });
        }

        let latexToCompile = latex;
        if (forceOnePage) {
            // Inject pagesel package to restrict to page 1
            // We inject it after \documentclass line usually, or just at the top if possible.
            // LaTeX usually requires packages in preamble.
            // A safe bet is replacing \documentclass{...} with \documentclass{...}\n\usepackage[1]{pagesel}
            // Or just prepending it if we assume standard template structure.
            // Actually, inserting after \documentclass is safer.
            if (latexToCompile.includes('\\documentclass')) {
                latexToCompile = latexToCompile.replace(
                    /(\\documentclass\[.*?\]\{.*?\})/,
                    "$1\n\\usepackage[1]{pagesel}"
                );
            } else {
                // Fallback
                latexToCompile = "\\usepackage[1]{pagesel}\n" + latexToCompile;
            }
        }

        // Note: latexonline.cc takes ?text=... 

        const response = await axios.get(
            `https://latexonline.cc/compile`,
            {
                params: {
                    text: latexToCompile,
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
