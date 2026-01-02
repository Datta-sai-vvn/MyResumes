'use client';

export default function PDFViewer({ pdfUrl, onReset, compilationFailed }) {
    const download = () => {
        if (!pdfUrl) return;
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = 'resume.pdf';
        a.click();
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Step 5: Your Customized Resume</h2>
                <div className="flex gap-3">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                    >
                        Start Over
                    </button>
                    {!compilationFailed && pdfUrl && (
                        <button
                            onClick={download}
                            className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium shadow-sm transition flex items-center gap-2"
                        >
                            <span>⬇️</span> Download PDF
                        </button>
                    )}
                </div>
            </div>

            {compilationFailed ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">PDF Compilation Failed</h3>
                    <p className="text-red-600 mb-6">
                        There was an issue compiling the LaTeX code to PDF. This usually happens with complex templates or timeout limits.
                    </p>
                    <div className="bg-white p-4 rounded border border-red-100 inline-block text-left text-sm text-gray-600 mb-6">
                        <p className="font-bold mb-2">Try this workaround:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Go back to <span className="font-mono bg-gray-100 px-1 rounded">Step 4</span></li>
                            <li>Click <strong>Download .tex</strong></li>
                            <li>Upload the file to <a href="https://www.overleaf.com" target="_blank" className="text-blue-600 hover:underline">Overleaf</a> or use a local LaTeX editor.</li>
                        </ol>
                    </div>
                    <div>
                        <button onClick={onReset} className="text-blue-600 hover:underline">Try with a different template</button>
                    </div>
                </div>
            ) : pdfUrl ? (
                <div className="border rounded-lg overflow-hidden shadow-lg bg-gray-50">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-[800px] border-none"
                        title="Resume PDF"
                    />
                </div>
            ) : (
                <div className="p-12 text-center text-gray-500">
                    <p>Waiting for PDF generation...</p>
                </div>
            )}
        </div>
    );
}
