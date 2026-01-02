# Resume Automation Tool

## Quick Start
1. Clone repo
2. `npm install`
3. Copy `.env.local.example` to `.env.local`
4. Add your OpenAI API key
5. `npm run dev`

## Deployment
1. Push to GitHub
2. Connect to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

## Usage
1. Enter a system prompt (or use the default) to guide the AI.
2. Paste the job description.
3. Click "Generate" to create resume sections.
4. Preview the LaTeX and click "Compile" to download the PDF.

## Troubleshooting
- **API Errors**: Ensure your OPENAI_API_KEY is correct and has credits.
- **Compilation Errors**: Check the LaTeX preview for syntax errors.

## API Reference
- `/api/generate-resume`: POST - Generates LaTeX content.
- `/api/compile-pdf`: POST - Compiles LaTeX to PDF.
- `/api/health-check`: GET - Service status.
