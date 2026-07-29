import React from 'react';
import { X, BookOpen, CheckCircle, Database, ShieldCheck, Server, Cpu } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden relative animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">KineticAge Software Engineer Assignment README</h2>
              <p className="text-xs text-slate-400 font-mono">Option 1: Slot Booking Application • Senior Wellness Platform</p>
            </div>
          </div>
          <button
            id="close-readme-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 text-slate-700 leading-relaxed text-sm">
          {/* Project Overview */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              1. Project Overview
            </h3>
            <p>
              <strong>KineticAge</strong> is a production-ready, full-stack Slot Booking Application tailored for senior wellness, mobility therapy, and fall prevention programs. It features dual user/admin roles, real-time slot generation, interactive checkout with Prepaid/COD payments, comprehensive analytics dashboards, and an <strong>ACID Transaction Engine</strong> that mathematically guarantees double booking prevention and zero race conditions.
            </p>
          </section>

          {/* ACID Transaction Engine Detail */}
          <section className="space-y-3 bg-teal-50/60 p-5 rounded-2xl border border-teal-100">
            <h3 className="text-base font-bold text-teal-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600" />
              2. ACID Transaction & Double Booking Protection Strategy
            </h3>
            <p className="text-xs text-teal-800 leading-relaxed">
              To handle high concurrency and satisfy strict ACID requirements without duplicate bookings:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-teal-950 font-medium">
              <li><strong>Atomicity:</strong> Booking creation, seat reduction, user slot check, and payment record creation execute as a single atomic unit. If any step fails, state rolls back automatically.</li>
              <li><strong>Consistency:</strong> Invariant check enforces <code>availableSeats &gt; 0</code> and status is not 'booked'.</li>
              <li><strong>Isolation:</strong> In-memory mutex transaction locks wrap slot reservation calls, guaranteeing zero race conditions during parallel checkout requests.</li>
              <li><strong>Durability:</strong> State updates persist across session API requests with Mongoose/MongoDB schema compatibility.</li>
            </ul>
          </section>

          {/* Folder Structure */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <Server className="w-5 h-5 text-indigo-600" />
              3. Folder Structure Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs bg-slate-900 text-slate-200 p-4 rounded-2xl">
              <div>
                <p className="text-teal-400 font-bold mb-1">backend/</p>
                <p>├── config/ (jwt.ts, db.ts)</p>
                <p>├── controllers/ (auth, service, slot, booking, payment, user)</p>
                <p>├── database/ (store.ts ACID engine)</p>
                <p>├── middleware/ (auth, role, error, validation)</p>
                <p>├── models/ (User, Service, Slot, Booking, Payment)</p>
                <p>└── routes/ (auth, service, slot, booking, payment, user)</p>
              </div>
              <div>
                <p className="text-indigo-400 font-bold mb-1">frontend/</p>
                <p>├── components/ (Navbar, Footer, ServiceCard, SlotPicker)</p>
                <p>├── context/ (AuthContext, BookingContext)</p>
                <p>├── pages/ (Landing, Login, Services, Booking, AdminDashboard)</p>
                <p>├── routes/ (AppRoutes, ProtectedRoute, AdminRoute)</p>
                <p>└── services/ (api, auth, slot, booking, payment)</p>
              </div>
            </div>
          </section>

          {/* REST API Reference */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <Database className="w-5 h-5 text-amber-600" />
              4. Key REST API Endpoints
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">POST</span>
                <span>/api/auth/register & /api/auth/login</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">GET</span>
                <span>/api/services & /api/slots?serviceId=&date=</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">POST</span>
                <span>/api/bookings (ACID Transaction execution)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded">PUT</span>
                <span>/api/bookings/cancel/:id (Restores slot seat)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">GET</span>
                <span>/api/user/admin/stats & /api/slots/generate-3days</span>
              </div>
            </div>
          </section>

          {/* Test Credentials */}
          <section className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              5. Quick Test Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-1">Admin Account</p>
                <p>Email: <code className="text-teal-700">admin@kineticage.com</code></p>
                <p>Password: <code className="text-teal-700">admin123</code></p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-1">User Account</p>
                <p>Email: <code className="text-indigo-700">user@kineticage.com</code></p>
                <p>Password: <code className="text-indigo-700">user123</code></p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="close-readme-bottom-btn"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
