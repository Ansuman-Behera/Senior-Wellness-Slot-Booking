import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReadmeModal } from './ReadmeModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleQuickSwitchRole = async (targetRole: 'admin' | 'user') => {
    if (targetRole === 'admin') {
      await login('admin@kineticage.com', 'admin123');
      navigate('/admin/dashboard');
    } else {
      await login('user@kineticage.com', 'user123');
      navigate('/dashboard');
    }
    setIsProfileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link id="nav-brand-logo" to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-all">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                Kinetic<span className="text-teal-600">Age</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Senior Wellness & Mobility
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            <Link
              id="nav-link-home"
              to="/"
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                isActive('/') ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              id="nav-link-services"
              to="/services"
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                isActive('/services') ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Services
            </Link>
            <Link
              id="nav-link-slots"
              to="/slots"
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                isActive('/slots') ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Slots
            </Link>

            {isAuthenticated && (
              <Link
                id="nav-link-dashboard"
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive('/dashboard') || isActive('/admin/dashboard')
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {/* README Assignment Modal trigger button */}
            <button
              id="nav-readme-btn"
              type="button"
              onClick={() => setIsReadmeOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Assignment README</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-profile-dropdown-btn"
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize flex items-center gap-1">
                      {isAdmin ? (
                        <span className="text-purple-600 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        'Senior Member'
                      )}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-scale-up">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      id="dropdown-profile"
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      id="dropdown-dashboard"
                      to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{isAdmin ? 'Admin Dashboard' : 'My Bookings'}</span>
                    </Link>

                    {/* Quick Demo Role Switcher for assignment testing */}
                    <div className="my-1 py-1 border-t border-slate-100">
                      <p className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Demo Role Switcher
                      </p>
                      <button
                        id="switch-to-admin-btn"
                        type="button"
                        onClick={() => handleQuickSwitchRole('admin')}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${
                          isAdmin ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>Switch to Admin</span>
                        {isAdmin && <span className="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded">Active</span>}
                      </button>
                      <button
                        id="switch-to-user-btn"
                        type="button"
                        onClick={() => handleQuickSwitchRole('user')}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${
                          !isAdmin ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>Switch to Senior Member</span>
                        {!isAdmin && <span className="text-[10px] bg-teal-200 px-1.5 py-0.5 rounded">Active</span>}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        id="dropdown-logout-btn"
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="nav-login-btn"
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  id="nav-register-btn"
                  to="/register"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Readme Modal */}
      <ReadmeModal isOpen={isReadmeOpen} onClose={() => setIsReadmeOpen(false)} />
    </>
  );
};
