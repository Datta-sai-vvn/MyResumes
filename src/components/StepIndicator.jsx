import React from 'react';

export default function StepIndicator({ currentStep }) {
    const steps = [
        { number: 1, label: 'Template' },
        { number: 2, label: 'Details' },
        { number: 3, label: 'Review' },
        { number: 4, label: 'Final Edit' },
        { number: 5, label: 'PDF' },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between w-full relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500 ease-in-out rounded"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center bg-gray-50 px-2 z-10">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step.number <= currentStep
                                    ? 'bg-primary text-white scale-110 shadow-md'
                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                }`}
                        >
                            {step.number < currentStep ? '✓' : step.number}
                        </div>
                        <span
                            className={`mt-2 text-xs font-medium transition-colors duration-300 ${step.number <= currentStep ? 'text-primary' : 'text-gray-400'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
