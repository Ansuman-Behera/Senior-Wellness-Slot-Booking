import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = async (demoRole: 'user' | 'admin') => {
    setErrorMessage('');
    setIsSubmitting(true);
    const demoEmail = demoRole === 'admin' ? 'admin@kineticage.com' : 'user@kineticage.com';
    const demoPass = demoRole === 'admin' ? 'admin123' : 'user123';

    try {
      const user = await login(demoEmail, demoPass);
      showToast(`Logged in as Demo ${demoRole === 'admin' ? 'Admin' : 'Senior Member'}!`, 'success');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-teal-50 rounded-2xl text-teal-600 border border-teal-100 mb-2">
            <Activity className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to KineticAge</h2>
          <p className="text-xs text-slate-500 font-medium">Access your senior wellness bookings & mobility care plan</p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 animate-slide-up">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@kineticage.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-slate-900 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> One-Click Assignment Demo Login
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="demo-user-login-btn"
              type="button"
              onClick={() => handleDemoFill('user')}
              disabled={isSubmitting}
              className="px-3 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Demo Senior Member</span>
            </button>

            <button
              id="demo-admin-login-btn"
              type="button"
              onClick={() => handleDemoFill('admin')}
              disabled={isSubmitting}
              className="px-3 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link id="login-to-register-link" to="/register" className="font-bold text-teal-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
