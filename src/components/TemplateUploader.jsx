import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TemplateUploader({ onTemplateReady }) {
    const [template, setTemplate] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load saved template from localStorage
        const saved = localStorage.getItem('resume-template');
        if (saved) {
            setTemplate(saved);
            validateTemplate(saved);
        } else {
            // Automatically try to load the default template from public folder if no local storage
            loadDefaultTemplate();
        }
    }, []);

    const loadDefaultTemplate = async () => {
        try {
            const res = await fetch('/resume-template.tex');
            if (res.ok) {
                const text = await res.text();
                setTemplate(text);
                validateTemplate(text);
            }
        } catch (e) {
            console.error("Failed to load default template", e);
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        setTemplate(text);
        validateTemplate(text);
    };

    const validateTemplate = async (templateText) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/validate-template', {
                template: templateText
            });
            setValidationResult(response.data);
        } catch (error) {
            setValidationResult({
                valid: false,
                error: error.response?.data?.error || 'Validation failed'
            });
        }
        setLoading(false);
    };

    const loadExampleTemplate = async () => {
        const response = await fetch('/example-template.tex');
        const text = await response.text();
        setTemplate(text);
        validateTemplate(text);
    };

    const saveAndContinue = () => {
        localStorage.setItem('resume-template', template);
        onTemplateReady(template);
    };

    const downloadMarkerGuide = () => {
        const guide = `
HOW TO ADD MARKERS TO YOUR RESUME TEMPLATE

Add these exact comment lines around the sections you want to customize:

1. SUMMARY SECTION:
% MARKER_BEGIN_SUMMARY
\\section*{Summary}
Your current summary text here...
% MARKER_END_SUMMARY

2. SKILLS SECTION:
% MARKER_BEGIN_SKILLS
\\section{Skills}
Your current skills here...
% MARKER_END_SKILLS

3. PROJECTS SECTION:
% MARKER_BEGIN_PROJECTS
\\section{Projects}
Your current projects here...
% MARKER_END_PROJECTS
    `;

        const blob = new Blob([guide], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marker-guide.txt';
        a.click();
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Step 1: Resume Template</h2>

            <div className="space-y-6">
                {/* Upload Zone */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition">
                    <input
                        type="file"
                        accept=".tex"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-gray-600 font-medium">Click to upload your .tex file</p>
                        <p className="text-gray-400 text-sm mt-1">or drag and drop here</p>
                    </label>
                </div>

                {/* Paste Zone */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Or paste your LaTeX code:
                    </label>
                    <textarea
                        value={template}
                        onChange={(e) => {
                            setTemplate(e.target.value);
                            validateTemplate(e.target.value);
                        }}
                        rows={15}
                        className="w-full font-mono text-xs border rounded p-4 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Paste your LaTeX template here..."
                    />
                </div>

                <div className="flex space-x-4">
                    {/* Example Template Button */}
                    <button
                        onClick={loadExampleTemplate}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 rounded border border-blue-200 transition"
                    >
                        Load Example Template
                    </button>
                    {/* Reset Button */}
                    <button
                        onClick={loadDefaultTemplate}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded border border-gray-200 transition"
                    >
                        Reset to My Template
                    </button>
                </div>


                {/* Validation Status */}
                {validationResult && (
                    <div className={`p-4 rounded-lg border ${validationResult.valid
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                        {validationResult.valid ? (
                            <div>
                                <p className="font-bold text-green-800 mb-2 flex items-center">
                                    ✅ Template Validated
                                </p>
                                <div className="text-sm text-green-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold mb-1 border-b border-green-200 pb-1">Editable Sections (AI Generated)</p>
                                        <ul className="space-y-1">
                                            <li className="flex items-center">✏️ Summary</li>
                                            <li className="flex items-center">✏️ Skills</li>
                                            <li className="flex items-center">✏️ Projects</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1 border-b border-green-200 pb-1">Protected Sections (Unchanged)</p>
                                        <ul className="space-y-1">
                                            <li className="flex items-center">🔒 Education</li>
                                            <li className="flex items-center">🔒 Experience</li>
                                            <li className="flex items-center">🔒 Contact Info</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="font-bold text-red-800 mb-2">
                                    ❌ Template validation failed
                                </p>
                                <p className="text-sm text-red-700 mb-3 bg-white p-2 rounded border border-red-100 font-mono">
                                    {validationResult.error}
                                </p>
                                <button
                                    onClick={downloadMarkerGuide}
                                    className="text-sm bg-white hover:bg-gray-50 text-red-800 px-4 py-2 rounded border border-red-200 shadow-sm"
                                >
                                    📥 Download Marker Guide
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Continue Button */}
                <button
                    onClick={saveAndContinue}
                    disabled={!validationResult?.valid || loading}
                    className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition transform hover:-translate-y-0.5 ${validationResult?.valid
                            ? 'bg-primary text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:transform-none'
                        }`}
                >
                    {loading ? 'Validating...' : 'Save Template & Continue →'}
                </button>
            </div>
        </div>
    );
}
