'use client';

import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import LoadingSpinner from '@/components/LoadingSpinner';
import TemplateUploader from '@/components/TemplateUploader';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import SectionPreview from '@/components/SectionPreview';
import LatexViewer from '@/components/LatexViewer';
import PDFViewer from '@/components/PDFViewer';
import { mergeSections } from '@/utils/templateProcessor';

export default function Home() {
    const [step, setStep] = useState(1);
    const [baseTemplate, setBaseTemplate] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [generatedSections, setGeneratedSections] = useState(null);
    const [finalLatex, setFinalLatex] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [compilationFailed, setCompilationFailed] = useState(false);

    // Constants to preserve state across re-renders/steps
    const handleTemplateHelper = (tmpl) => {
        setBaseTemplate(tmpl);
        setStep(2);
    };

    const handleGenerate = async (prompt) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/generate-sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemPrompt: prompt, jobDescription })
            });
            const data = await res.json();

            if (data.success) {
                setGeneratedSections(data.sections);
                setStep(3);
            } else {
                throw new Error(data.error || 'Failed to generate sections');
            }
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    const handleMerge = (sections) => {
        setGeneratedSections(sections);
        const merged = mergeSections(baseTemplate, sections);
        setFinalLatex(merged);
        setStep(4);
    };

    const handleCompile = async () => {
        setLoading(true);
        setCompilationFailed(false);
        try {
            const res = await fetch('/api/compile-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latex: finalLatex })
            });

            const data = await res.json();

            if (data.success) {
                // Convert base64 to blob for display
                const byteCharacters = atob(data.pdf);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });

                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setStep(5);
            } else {
                console.error("Compilation failed:", data.error);
                setCompilationFailed(true);
                setStep(5);
            }
        } catch (e) {
            console.error("Compilation error:", e);
            setCompilationFailed(true);
            setStep(5);
        }
        setLoading(false);
    };

    const reset = () => {
        setStep(1); // Go back to start
        setBaseTemplate('');
        setJobDescription('');
        setGeneratedSections(null);
        setFinalLatex('');
        setPdfUrl('');
        setCompilationFailed(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📄</span>
                        <h1 className="text-xl font-bold text-gray-900">Resume Automation</h1>
                    </div>
                    <div className="text-sm text-gray-500">v1.0</div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
                <StepIndicator currentStep={step} />

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {loading && <LoadingSpinner message={step === 2 ? "Generating content with AI..." : "Compiling PDF..."} />}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                    {step === 1 && (
                        <TemplateUploader onTemplateReady={handleTemplateHelper} />
                    )}

                    {step === 2 && (
                        <JobDescriptionInput
                            value={jobDescription}
                            onChange={setJobDescription}
                            onGenerate={handleGenerate}
                            loading={loading}
                        />
                    )}

                    {step === 3 && (
                        <SectionPreview
                            sections={generatedSections}
                            onSectionsUpdate={setGeneratedSections}
                            onContinue={handleMerge}
                        />
                    )}

                    {step === 4 && (
                        <LatexViewer
                            latex={finalLatex}
                            onCompile={handleCompile}
                            compiling={loading}
                        />
                    )}

                    {step === 5 && (
                        <PDFViewer
                            pdfUrl={pdfUrl}
                            latex={finalLatex}
                            onReset={reset}
                            compilationFailed={compilationFailed}
                        />
                    )}
                </div>
            </main>

            <footer className="bg-white border-t py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    Resume Automation Tool &copy; 2026
                </div>
            </footer>
        </div>
    );
}
