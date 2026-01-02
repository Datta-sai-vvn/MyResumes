import React, { useState } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// Simplification: Using textarea for edit mode basics for now to avoid large dependency overhead if not strictly needed
// But since we asked for syntax highlighting, let's try to use simple pre/code blocks if the package is tricky, or just standard textarea for editing.
// Re-reading requirements: "Inline LaTeX editor for each section".
// We installed react-simple-code-editor and prismjs, let's use them!

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-latex';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

export default function SectionPreview({ sections, onSectionsUpdate, onContinue }) {
    const [editMode, setEditMode] = useState({
        summary: false,
        skills: false,
        projects: false
    });

    const [editedSections, setEditedSections] = useState({
        summary: sections.summary,
        skills: sections.skills,
        projects: sections.projects
    });

    const handleEditChange = (section, value) => {
        setEditedSections(prev => ({
            ...prev,
            [section]: value
        }));
    };

    const saveEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: false }));
        onSectionsUpdate(editedSections);
    };

    const cancelEdit = (section) => {
        setEditedSections(prev => ({
            ...prev,
            [section]: sections[section]
        }));
        setEditMode(prev => ({ ...prev, [section]: false }));
    };

    const SectionCard = ({ title, sectionKey, content, icon }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>{icon}</span>
                    {title}
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                        Editable
                    </span>
                </h3>
                {!editMode[sectionKey] ? (
                    <button
                        onClick={() => setEditMode(prev => ({ ...prev, [sectionKey]: true }))}
                        className="flex items-center gap-1 text-primary hover:text-blue-800 font-medium text-sm transition"
                    >
                        ✏️ Edit Section
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => saveEdit(sectionKey)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition"
                        >
                            ✓ Save
                        </button>
                        <button
                            onClick={() => cancelEdit(sectionKey)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition"
                        >
                            ✕ Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className={`rounded-md overflow-hidden border ${editMode[sectionKey] ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                {editMode[sectionKey] ? (
                    <Editor
                        value={editedSections[sectionKey] || ''}
                        onValueChange={(code) => handleEditChange(sectionKey, code)}
                        highlight={code => highlight(code, languages.latex || languages.text, 'latex')}
                        padding={16}
                        style={{
                            fontFamily: '"Fira Code", "Fira Mono", monospace',
                            fontSize: 14,
                            backgroundColor: '#ffffff', // Edit mode light for contrast
                            minHeight: '150px'
                        }}
                        textareaClassName="focus:outline-none"
                    />
                ) : (
                    <div className="p-4 bg-gray-50 text-sm font-mono whitespace-pre-wrap text-gray-800">
                        {/* Simple render for reading mode */}
                        {content}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-gray-900">
                    Review Generated Sections
                </h2>
                <span className="text-sm text-gray-500">Step 3 of 5</span>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                <span className="text-xl">💡</span>
                <p className="text-sm text-yellow-800">
                    <strong>Review Carefully:</strong> These sections were generated by AI.
                    You can edit them now. The Education and Experience sections from your template remain unchanged and are not shown here.
                </p>
            </div>

            <SectionCard
                title="Summary"
                sectionKey="summary"
                content={editedSections.summary}
                icon="📝"
            />

            <SectionCard
                title="Skills"
                sectionKey="skills"
                content={editedSections.skills}
                icon="🛠️"
            />

            <SectionCard
                title="Projects"
                sectionKey="projects"
                content={editedSections.projects}
                icon="🚀"
            />

            <div className="mt-8 p-6 bg-gray-100 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-4 font-bold border-b border-gray-300 pb-2">
                    Protected Sections (Will not be modified)
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-gray-400">🔒</span> Education</li>
                    <li className="flex items-center gap-2"><span className="text-gray-400">🔒</span> Experience</li>
                    <li className="flex items-center gap-2"><span className="text-gray-400">🔒</span> Contact Information</li>
                </ul>
            </div>

            <button
                onClick={() => onSectionsUpdate(editedSections) || onContinue(editedSections)} // Ensure updates propagate
                className="w-full py-4 mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group"
            >
                Confirm & Continue to Final Review
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
        </div>
    );
}
