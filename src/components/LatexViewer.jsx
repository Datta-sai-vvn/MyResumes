'use client';

export default function LatexViewer({ latex, onCompile, compiling }) {
    const download = () => {
        const blob = new Blob([latex], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.tex';
        a.click();
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Step 4: Review LaTeX</h2>
            <div className="flex gap-3 mb-4">
                <button
                    onClick={download}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                    Download .tex
                </button>
                <button
                    onClick={onCompile}
                    disabled={compiling}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
                >
                    {compiling ? 'Compiling...' : 'Compile PDF'}
                </button>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <pre className="p-4 bg-gray-900 text-gray-100 overflow-auto max-h-[500px] text-sm font-mono">
                    {latex}
                </pre>
            </div>
        </div>
    );
}
