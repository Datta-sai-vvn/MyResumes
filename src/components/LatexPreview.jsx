import React from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LatexPreview({ latexCode }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(latexCode);
        toast.success('LaTeX code copied to clipboard!');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Generated LaTeX</h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-sm text-primary hover:text-blue-700"
                >
                    <Copy size={16} />
                    <span>Copy</span>
                </button>
            </div>
            <div className="relative flex-grow min-h-[400px]">
                <textarea
                    readOnly
                    value={latexCode}
                    className="w-full h-full p-4 font-mono text-xs bg-gray-50 border border-gray-300 rounded-md resize-none focus:outline-none"
                />
            </div>
        </div>
    );
}
