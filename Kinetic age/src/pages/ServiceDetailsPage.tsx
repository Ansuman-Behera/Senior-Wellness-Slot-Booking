import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Calendar, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { slotService } from '../services/slotService';
import { Service, Slot } from '../types';
import { SlotPicker } from '../components/SlotPicker';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../components/Toast';

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { state, setSelectedService, setSelectedDate, setSelectedSlot, setStep } = useBooking();

  useEffect(() => {
    if (!id) return;
    const loadDetails = async () => {
      try {
        const srv = await serviceService.getServiceById(id);
        setService(srv);
        setSelectedService(srv);

        const slotList = await slotService.getSlots({ serviceId: id });
        setSlots(slotList);
      } catch (err: any) {
        showToast('Failed to load service details', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleProceedToPayment = () => {
    if (!state.selectedSlot) {
      showToast('Please select an available time slot first.', 'info');
      return;
    }
    setStep(3);
    navigate('/booking');
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" label="Loading service details and available slots..." className="min-h-[60vh]" />;
  }

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-xs text-slate-500">The requested senior service program may have been updated or removed.</p>
        <Link to="/services" className="inline-block px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">
          Back to All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services Catalogue</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Service Details Card */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-100">
            {service.category}
          </span>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{service.title}</h1>

          <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>{service.duration} Minutes Session</span>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{service.price}</div>
          </div>

          <div className="space-y-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Certified Senior Physical Therapist & Gait Specialist</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Safe ergonomics and emergency protocols included</span>
            </div>
          </div>
        </div>

        {/* Slot Picker Column */}
        <div className="lg:col-span-7 space-y-6">
          <SlotPicker
            slots={slots}
            selectedDate={state.selectedDate}
            selectedSlot={state.selectedSlot}
            onSelectDate={(d) => setSelectedDate(d)}
            onSelectSlot={(s) => setSelectedSlot(s)}
          />

          <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-medium">Selected Slot</p>
              <p className="text-sm font-bold text-teal-300">
                {state.selectedSlot
                  ? `${state.selectedDate} @ ${state.selectedSlot.startTime} - ${state.selectedSlot.endTime}`
                  : 'No slot selected yet'}
              </p>
            </div>

            <button
              id="service-details-proceed-btn"
              type="button"
              onClick={handleProceedToPayment}
              disabled={!state.selectedSlot}
              className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                state.selectedSlot
                  ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
