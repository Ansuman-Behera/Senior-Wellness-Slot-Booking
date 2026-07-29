import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Select Service' },
  { number: 2, label: 'Choose Slot' },
  { number: 3, label: 'Payment Method' },
  { number: 4, label: 'Confirmation' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

        <div
          className="absolute top-1/2 left-0 h-0.5 bg-teal-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-teal-600 text-white shadow-teal-600/20'
                    : isCurrent
                    ? 'bg-slate-900 text-white ring-4 ring-slate-900/10'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : step.number}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center hidden sm:block ${
                  isCurrent ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
