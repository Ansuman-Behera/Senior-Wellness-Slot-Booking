import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto border border-teal-100 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
          <p className="text-xs text-slate-500">
            The page you are looking for does not exist or has been moved within KineticAge.
          </p>
        </div>
        <Link
          id="not-found-back-home-btn"
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow hover:bg-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
