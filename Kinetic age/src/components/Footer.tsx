import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, PhoneCall, Shield, Heart, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Kinetic<span className="text-teal-400">Age</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering senior vitality, mobility assessment, and fall prevention through expert-guided care and atomic slot scheduling.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-950/60 px-3 py-2 rounded-xl border border-teal-800/50 w-fit">
              <Shield className="w-4 h-4" />
              <span>Verified Senior Care Protocol</span>
            </div>
          </div>

          {/* Wellness Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Senior Services</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/services" className="hover:text-teal-400 transition-colors">Senior Physiotherapy</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition-colors">Mobility Assessment</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition-colors">Fall Prevention Program</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition-colors">Yoga for Seniors</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition-colors">Balance Training</Link></li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/slots" className="hover:text-teal-400 transition-colors">Check 3-Day Slots</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-400 transition-colors">Member Dashboard</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-teal-400 transition-colors">Admin Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Account Login</Link></li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Care Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>24/7 Helpline: +1 (800) 546-3842</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@kineticage.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>KineticAge Mobility Center, CA</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 KineticAge Senior Wellness Platform. Built for Intern Assignment Option 1.</p>
          <div className="flex items-center gap-1 font-medium text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Senior Care Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
