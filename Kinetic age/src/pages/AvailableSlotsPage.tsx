import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, Clock, Sparkles } from 'lucide-react';
import { slotService } from '../services/slotService';
import { serviceService } from '../services/serviceService';
import { Slot, Service } from '../types';
import { SlotPicker } from '../components/SlotPicker';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../components/Toast';

export const AvailableSlotsPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { state, setSelectedService, setSelectedDate, setSelectedSlot, setStep } = useBooking();

  const fetchSlotsAndServices = async () => {
    setIsLoading(true);
    try {
      const [slotList, srvList] = await Promise.all([
        slotService.getSlots(selectedServiceId !== 'all' ? { serviceId: selectedServiceId } : undefined),
        serviceService.getServices(),
      ]);
      setSlots(slotList);
      setServices(srvList);
    } catch (err) {
      showToast('Failed to load slots schedule.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsAndServices();
  }, [selectedServiceId]);

  const handleBookSlot = (slot: Slot) => {
    const matchingService = services.find((s) => s.id === slot.serviceId);
    if (!matchingService) {
      showToast('Associated service not found', 'error');
      return;
    }

    setSelectedService(matchingService);
    setSelectedSlot(slot);
    setStep(3);
    navigate('/booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3-Day Rolling Schedule</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Available Session Time Slots</h1>
          <p className="text-xs text-slate-300 font-normal">
            Real-time seat availability for Today, Tomorrow, and Day After. Fully booked slots are strictly disabled.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="min-w-[220px]">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" /> Filter By Program
          </label>
          <select
            id="slot-service-filter-select"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full bg-slate-800 text-white border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Senior Programs</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" label="Loading rolling 3-day time slots..." className="min-h-[50vh]" />
      ) : (
        <div className="space-y-6">
          <SlotPicker
            slots={slots}
            selectedDate={state.selectedDate}
            selectedSlot={state.selectedSlot}
            onSelectDate={(d) => setSelectedDate(d)}
            onSelectSlot={(s) => handleBookSlot(s)}
          />

          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between text-xs text-teal-900 font-medium">
            <span>
              <strong>Note:</strong> Select any slot above to jump directly into payment and instant confirmation.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
