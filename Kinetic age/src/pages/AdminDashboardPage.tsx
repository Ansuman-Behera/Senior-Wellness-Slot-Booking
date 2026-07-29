import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  Percent,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Ban,
  Clock,
  Search,
} from 'lucide-react';
import { userService } from '../services/userService';
import { serviceService } from '../services/serviceService';
import { slotService } from '../services/slotService';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { AdminDashboardStats, Service, Slot, Booking, Payment, User } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/Toast';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [activeTab, setActiveTab] = useState<'services' | 'slots' | 'bookings' | 'payments' | 'users'>('services');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    duration: 45,
    price: 75,
    category: 'Wellness' as any,
    iconName: 'Activity',
  });

  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isGeneratingSlots, setIsGeneratingSlots] = useState<boolean>(false);

  const { showToast } = useToast();

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, srvList, slotList, bookingList, paymentList, userList] = await Promise.all([
        userService.getAdminStats(),
        serviceService.getServices(),
        slotService.getSlots(),
        bookingService.getAllBookingsAdmin(),
        paymentService.getAllPaymentsAdmin(),
        userService.getAllUsersAdmin(),
      ]);

      setStats(statsData);
      setServices(srvList);
      setSlots(slotList);
      setBookings(bookingList);
      setPayments(paymentList);
      setUsers(userList);
    } catch (err: any) {
      showToast('Failed to load admin management portal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceFormData({
      title: '',
      description: '',
      duration: 45,
      price: 75,
      category: 'Wellness',
      iconName: 'Activity',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setServiceFormData({
      title: srv.title,
      description: srv.description,
      duration: srv.duration,
      price: srv.price,
      category: srv.category,
      iconName: srv.iconName || 'Activity',
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title || !serviceFormData.description) {
      showToast('Title and description are required.', 'error');
      return;
    }

    try {
      if (editingService) {
        await serviceService.updateService(editingService.id, serviceFormData);
        showToast('Service updated successfully!', 'success');
      } else {
        await serviceService.createService(serviceFormData);
        showToast('New Service created! 3-day slots generated automatically.', 'success');
      }
      setIsServiceModalOpen(false);
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save service', 'error');
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await serviceService.deleteService(serviceToDelete.id);
      showToast('Service deleted successfully.', 'success');
      setServiceToDelete(null);
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerate3DaySlots = async () => {
    setIsGeneratingSlots(true);
    try {
      await slotService.generate3DaySlots();
      showToast('3-Day slots schedule regenerated for all active services!', 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast('Failed to regenerate slots schedule', 'error');
    } finally {
      setIsGeneratingSlots(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" label="Loading KineticAge Admin Control Center..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">KineticAge Management Portal</h1>
          <p className="text-xs text-slate-400 font-normal">
            Manage senior wellness services, rolling slots, live bookings, and payment ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="admin-generate-slots-btn"
            type="button"
            onClick={handleGenerate3DaySlots}
            disabled={isGeneratingSlots}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSlots ? 'animate-spin' : ''}`} />
            <span>Regenerate 3-Day Slots</span>
          </button>

          <button
            id="admin-create-service-btn"
            type="button"
            onClick={handleOpenCreateService}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            <span>Create New Service</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
          <p className="text-[10px] text-slate-400">Registered Members</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalBookings || 0}</p>
          <p className="text-[10px] text-slate-400">Lifetime reservations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Bookings</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats?.todaysBookings || 0}</p>
          <p className="text-[10px] text-slate-400">Scheduled today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-teal-700">₹{stats?.totalRevenue || 0}</p>
          <p className="text-[10px] text-slate-400">Paid transaction volume</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Slot Utilization</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700">{stats?.slotUtilizationRate || 0}%</p>
          <p className="text-[10px] text-slate-400">Seat fill efficiency</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          id="admin-tab-services"
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'services' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Services ({services.length})
        </button>

        <button
          id="admin-tab-slots"
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'slots' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3-Day Slots ({slots.length})
        </button>

        <button
          id="admin-tab-bookings"
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bookings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bookings Ledger ({bookings.length})
        </button>

        <button
          id="admin-tab-payments"
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'payments' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payments Ledger ({payments.length})
        </button>

        <button
          id="admin-tab-users"
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Users Directory ({users.length})
        </button>
      </div>

      {/* TAB 1: Services Management */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Senior Services</span>
            <button
              id="services-add-btn"
              onClick={handleOpenCreateService}
              className="px-3.5 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Create Service
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((srv) => (
              <div key={srv.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                      {srv.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">{srv.duration} mins</p>
                    <p className="text-lg font-black text-slate-900">₹{srv.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-service-btn-${srv.id}`}
                      type="button"
                      onClick={() => handleOpenEditService(srv)}
                      className="p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      id={`delete-service-btn-${srv.id}`}
                      type="button"
                      onClick={() => setServiceToDelete(srv)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Slots Table */}
      {activeTab === 'slots' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">3-Day Rolling Slot Registry</span>
            <span className="text-xs text-slate-500 font-medium">{slots.length} Total Slot Windows</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Slot Date</th>
                  <th className="p-4">Time Window</th>
                  <th className="p-4">Service Program</th>
                  <th className="p-4 text-center">Booked / Capacity</th>
                  <th className="p-4 text-center">Available</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{slot.date}</td>
                    <td className="p-4">{slot.startTime} - {slot.endTime}</td>
                    <td className="p-4 text-slate-700">{slot.serviceTitle || slot.serviceId}</td>
                    <td className="p-4 text-center">{slot.bookedSeats} / {slot.capacity}</td>
                    <td className="p-4 text-center font-bold text-teal-700">{slot.availableSeats}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          slot.availableSeats <= 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        {slot.availableSeats <= 0 ? 'Full' : 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Bookings Ledger */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">All Client Reservations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-slate-900">{b.bookingId}</td>
                    <td className="p-4">{b.userName}</td>
                    <td className="p-4 font-semibold text-slate-800">{b.serviceTitle}</td>
                    <td className="p-4">{b.date} ({b.startTime})</td>
                    <td className="p-4">₹{b.price} ({b.paymentType})</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Payments Ledger */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Payment Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-slate-900">{p.bookingId}</td>
                    <td className="p-4 font-black text-slate-900">₹{p.amount}</td>
                    <td className="p-4">{p.paymentMethod}</td>
                    <td className="p-4 font-mono text-slate-500">{p.transactionRef}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Registered Platform Members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 font-mono text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">{u.phone || 'N/A'}</td>
                    <td className="p-4 text-slate-500">{u.emergencyContact || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              {editingService ? 'Edit Senior Service' : 'Create New Senior Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Service Title *</label>
                <input
                  id="service-modal-title"
                  type="text"
                  required
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior Balance & Stability"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description *</label>
                <textarea
                  id="service-modal-desc"
                  required
                  rows={3}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed program therapeutic goals..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Duration (Mins)</label>
                  <input
                    id="service-modal-duration"
                    type="number"
                    value={serviceFormData.duration}
                    onChange={(e) => setServiceFormData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Price (₹)</label>
                  <input
                    id="service-modal-price"
                    type="number"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select
                  id="service-modal-category"
                  value={serviceFormData.category}
                  onChange={(e) => setServiceFormData((prev) => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Physiotherapy">Physiotherapy</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Safety">Safety</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  id="service-modal-cancel-btn"
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="service-modal-submit-btn"
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!serviceToDelete}
        title="Delete Senior Service Program?"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? Existing bookings will remain intact, but future slot generation for this service will be stopped.`}
        confirmLabel="Yes, Delete Service"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteService}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
};
