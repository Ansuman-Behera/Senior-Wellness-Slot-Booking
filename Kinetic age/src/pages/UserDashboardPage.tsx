import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CreditCard,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';
import { UserDashboardStats, Booking, Payment } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';

export const UserDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all' | 'payments'>('upcoming');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const { showToast } = useToast();

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [statsData, bookingList] = await Promise.all([
        userService.getUserStats(),
        bookingService.getMyBookings(),
      ]);
      setStats(statsData);
      setBookings(bookingList);
    } catch (err) {
      showToast('Failed to load dashboard records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(bookingToCancel.id);
      showToast('Booking cancelled successfully. Slot seat has been restored.', 'success');
      setBookingToCancel(null);
      await loadDashboard();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' && b.date >= todayStr
  );
  const pastBookings = bookings.filter(
    (b) => b.bookingStatus === 'completed' || b.bookingStatus === 'cancelled' || (b.bookingStatus === 'confirmed' && b.date < todayStr)
  );

  const displayBookings =
    activeTab === 'upcoming' ? upcomingBookings : activeTab === 'past' ? pastBookings : bookings;

  if (isLoading) {
    return <LoadingSpinner size="lg" label="Loading member dashboard & booking ledger..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Senior Wellness Portal</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">My Member Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">Track active sessions, payment history, and slot cancellations</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="user-dashboard-refresh-btn"
            type="button"
            onClick={loadDashboard}
            className="p-3 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            id="dashboard-book-new-btn"
            to="/services"
            className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Session</span>
          </Link>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Bookings</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.upcomingBookingsCount || 0}</p>
          <p className="text-[11px] text-slate-500">Active sessions scheduled</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Past Completed</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.pastBookingsCount || 0}</p>
          <p className="text-[11px] text-slate-500">Sessions completed to date</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Spent</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-teal-700">₹{stats?.totalSpent || 0}</p>
          <p className="text-[11px] text-slate-500">Paid wellness investments</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          id="tab-upcoming-bookings"
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming Bookings ({upcomingBookings.length})
        </button>

        <button
          id="tab-past-bookings"
          type="button"
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'past' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Past History ({pastBookings.length})
        </button>

        <button
          id="tab-all-bookings"
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Full Ledger ({bookings.length})
        </button>
      </div>

      {/* Bookings List Display */}
      {displayBookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8 text-teal-600" />}
          title={`No ${activeTab} bookings found`}
          description="Ready to schedule your next senior mobility or balance session?"
          actionLabel="Book a Session Now"
          onAction={() => (window.location.href = '/services')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayBookings.map((b) => (
            <div
              key={b.id}
              className={`bg-white p-6 rounded-3xl border transition-all space-y-4 shadow-sm ${
                b.bookingStatus === 'cancelled'
                  ? 'border-slate-200 opacity-75 bg-slate-50/50'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {b.bookingId}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                      b.bookingStatus === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : b.bookingStatus === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                      b.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : b.paymentStatus === 'Refunded'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {b.paymentStatus}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{b.serviceTitle}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {b.date} @ {b.startTime} - {b.endTime}
                  </span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="font-bold text-slate-800">{b.paymentType}</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Price</span>
                  <span className="font-black text-slate-900 text-base">₹{b.price}</span>
                </div>
              </div>

              {/* Cancel Button (Enabled for confirmed upcoming bookings) */}
              {b.bookingStatus === 'confirmed' && (
                <div className="pt-2 flex justify-end">
                  <button
                    id={`cancel-booking-btn-${b.id}`}
                    type="button"
                    onClick={() => setBookingToCancel(b)}
                    className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!bookingToCancel}
        title="Cancel Booking & Restore Slot?"
        message={`Are you sure you want to cancel booking ${bookingToCancel?.bookingId} for "${bookingToCancel?.serviceTitle}"? The reserved slot seat will be immediately released back to available status.`}
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        isDanger={true}
        isLoading={isCancelling}
        onConfirm={handleCancelBooking}
        onCancel={() => setBookingToCancel(null)}
      />
    </div>
  );
};
