import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-teal-500/20 border-t-teal-600 rounded-full animate-spin`}
      />
      {label && <p className="text-xs font-medium text-slate-500 tracking-wide">{label}</p>}
    </div>
  );
};
