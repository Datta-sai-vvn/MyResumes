import React, { useState, useEffect } from 'react';

const DEFAULT_SYSTEM_PROMPT = `You are an expert resume writer and career coach. 
Your task is to rewrite the "Summary", "Skills", and "Projects" sections of a resume to perfectly match the provided Job Description.

GUIDELINES:
1. SUMMARY: Write a compelling 3-4 line professional summary. Highlight years of experience and key achievements relevant to the JD.
2. SKILLS: List technical skills in categories (e.g., Languages, Tools, Frameworks). Prioritize skills mentioned in the JD.
3. PROJECTS: select 2-3 relevant projects. For each, write 3 bullet points focusing on impact, metrics, and technologies used.

TONE:
Professional, action-oriented, and quantifiable. Use strong action verbs.`;

export default function PromptEditor({ initialPrompt, onPromptChange }) {
    const [prompt, setPrompt] = useState(initialPrompt || DEFAULT_SYSTEM_PROMPT);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        // If parent passes empty initial prompt (first load), set default
        if (!initialPrompt) {
            onPromptChange(DEFAULT_SYSTEM_PROMPT);
        } else {
            setPrompt(initialPrompt);
        }
    }, [initialPrompt, onPromptChange]);

    const handleChange = (e) => {
        const newVal = e.target.value;
        setPrompt(newVal);
        onPromptChange(newVal);
    };

    const handleReset = () => {
        setPrompt(DEFAULT_SYSTEM_PROMPT);
        onPromptChange(DEFAULT_SYSTEM_PROMPT);
        setIsResetting(true);
        setTimeout(() => setIsResetting(false), 1000);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-2 flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">System Instructions</label>
                <button
                    onClick={handleReset}
                    className="text-xs text-blue-600 hover:text-blue-800 underline disabled:text-gray-400"
                    disabled={prompt === DEFAULT_SYSTEM_PROMPT}
                >
                    {isResetting ? 'Reset!' : 'Reset to Default'}
                </button>
            </div>
            <textarea
                value={prompt}
                onChange={handleChange}
                className="w-full flex-grow min-h-[200px] p-3 border border-gray-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-primary focus:border-primary resize-y"
                placeholder="Enter instructions for the AI..."
            />
            <p className="text-xs text-gray-400 mt-1">
                Customize how the AI writes your resume.
            </p>
        </div>
    );
}
