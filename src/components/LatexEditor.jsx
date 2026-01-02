import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-latex';
import 'prismjs/themes/prism-tomorrow.css';

export default function LatexEditor({ initialLatex, onLatexUpdate }) {
    const [latex, setLatex] = useState(initialLatex);
    const [showMarkers, setShowMarkers] = useState(true);

    const highlightWithMarkers = (code) => {
        let highlighted = highlight(code, languages.latex || languages.text, 'latex');

        if (showMarkers) {
            // Highlight marker lines
            highlighted = highlighted.replace(
                /(% MARKER_(BEGIN|END)_(SUMMARY|SKILLS|PROJECTS))/g,
                '<span style="background-color: #584c0c; color: #ffeb3b; font-weight: bold; padding: 0 4px; border-radius: 4px;">$1</span>'
            );
        }

        return highlighted;
    };

    const downloadLatex = () => {
        const blob = new Blob([latex], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume-edited.tex';
        a.click();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Advanced LaTeX Editor</h2>
                    <p className="text-sm text-gray-500">Step 4: Final Polish</p>
                </div>

                <div className="flex gap-3 items-center">
                    <label className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={showMarkers}
                            onChange={(e) => setShowMarkers(e.target.checked)}
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        Highlight Markers
                    </label>
                    <button
                        onClick={downloadLatex}
                        className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 shadow-sm transition flex items-center gap-2"
                    >
                        <span>📥</span> Download .tex
                    </button>
                    <button
                        onClick={() => onLatexUpdate(latex)}
                        className="bg-primary hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow-sm transition flex items-center gap-2"
                    >
                        <span>✓</span> Update for Compilation
                    </button>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative">
                <Editor
                    value={latex}
                    onValueChange={(code) => {
                        setLatex(code);
                        onLatexUpdate(code); // Live update
                    }}
                    highlight={highlightWithMarkers}
                    padding={24}
                    style={{
                        fontFamily: '"Fira Code", "Courier New", monospace',
                        fontSize: 14,
                        backgroundColor: '#1e1e1e', // Dark editor
                        color: '#d4d4d4',
                        minHeight: '600px',
                        lineHeight: 1.6
                    }}
                    textareaClassName="focus:outline-none"
                />
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-600">
                <div className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <p>
                        This is the raw LaTeX code that will be compiled. PRO TIP: If you see blank pages or errors, check for unescaped special characters like &, $, or % in your content.
                    </p>
                </div>

                <div className="flex gap-4 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Summary
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Skills
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Projects
                    </div>
                </div>
            </div>
        </div>
    );
}
