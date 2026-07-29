import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Clock,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { serviceService } from '../services/serviceService';
import { slotService } from '../services/slotService';
import { bookingService } from '../services/bookingService';
import { Service, Slot, PaymentType, Booking } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { SlotPicker } from '../components/SlotPicker';
import { StepIndicator } from '../components/StepIndicator';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const BookingPage: React.FC = () => {
  const { state, setSelectedService, setSelectedDate, setSelectedSlot, setPaymentType, setStep, resetBooking } =
    useBooking();

  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvList, slotList] = await Promise.all([
          serviceService.getServices(),
          slotService.getSlots(state.selectedService ? { serviceId: state.selectedService.id } : undefined),
        ]);
        setServices(srvList);
        setSlots(slotList);
      } catch (err) {
        showToast('Failed to load booking choices', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [state.selectedService?.id]);

  const handleConfirmBookingTransaction = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to confirm your booking.', 'info');
      navigate('/login');
      return;
    }

    if (!state.selectedService || !state.selectedSlot) {
      showToast('Please select both a service and time slot.', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Execute ACID Transaction endpoint
      const result = await bookingService.createBooking({
        serviceId: state.selectedService.id,
        slotId: state.selectedSlot.id,
        paymentType: state.paymentType,
      });

      setConfirmedBooking(result.booking);
      setStep(4);
      showToast('Booking confirmed! Slot reserved atomically.', 'success');
    } catch (err: any) {
      const msg = err.message || 'Booking transaction failed. Please try again.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" label="Initializing KineticAge Checkout..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Visual Step Progress Indicator */}
      <StepIndicator currentStep={state.step} />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs font-semibold text-rose-800 animate-slide-up">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* STEP 1: Select Service */}
      {state.step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Step 1: Choose Senior Program</h2>
            <p className="text-xs text-slate-500 font-medium">Select a certified wellness or mobility assessment service</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                isSelected={state.selectedService?.id === srv.id}
                onSelectService={(selected) => {
                  setSelectedService(selected);
                  setStep(2);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Available Time Slot */}
      {state.step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <button
              id="step2-back-btn"
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </button>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold">Selected Service</p>
              <p className="text-sm font-bold text-teal-700">{state.selectedService?.title}</p>
            </div>
          </div>

          <SlotPicker
            slots={slots}
            selectedDate={state.selectedDate}
            selectedSlot={state.selectedSlot}
            onSelectDate={(d) => setSelectedDate(d)}
            onSelectSlot={(s) => setSelectedSlot(s)}
          />

          <div className="flex justify-end pt-4">
            <button
              id="step2-next-btn"
              type="button"
              disabled={!state.selectedSlot}
              onClick={() => setStep(3)}
              className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                state.selectedSlot
                  ? 'bg-slate-900 hover:bg-teal-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Next: Payment Method</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment Method Selection */}
      {state.step === 3 && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <button
            id="step3-back-btn"
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Slot Picker
          </button>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Step 3: Select Payment Method</h2>
              <p className="text-xs text-slate-500 font-medium">Prepaid or Cash on Delivery (COD) for your convenience</p>
            </div>

            {/* Booking Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{state.selectedService?.title}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Schedule:</span>
                <span className="font-bold text-slate-900">
                  {state.selectedDate} ({state.selectedSlot?.startTime} - {state.selectedSlot?.endTime})
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-700">Total Payable:</span>
                <span className="font-black text-teal-700">₹{state.selectedService?.price}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                id="payment-type-prepaid-btn"
                type="button"
                onClick={() => setPaymentType('Prepaid')}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  state.paymentType === 'Prepaid'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <CreditCard className="w-6 h-6 text-teal-600" />
                  <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Instant Paid
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-0.5">Prepaid Payment</h4>
                  <p className="text-[11px] text-slate-500">Status = Paid. Instant digital verification receipt.</p>
                </div>
              </button>

              <button
                id="payment-type-cod-btn"
                type="button"
                onClick={() => setPaymentType('Cash on Delivery')}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  state.paymentType === 'Cash on Delivery'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Banknote className="w-6 h-6 text-amber-600" />
                  <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    COD
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-0.5">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-500">Status = Pending. Pay therapist upon session arrival.</p>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by ACID Concurrency Lock</span>
              </div>

              <button
                id="confirm-booking-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBookingTransaction}
                className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmation Receipt */}
      {state.step === 4 && confirmedBooking && (
        <div className="max-w-2xl mx-auto space-y-6 animate-scale-up">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Booking Successfully Reserved</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                Booking ID: {confirmedBooking.bookingId}
              </h2>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Senior Member:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.userName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Program Title:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.serviceTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="font-bold text-slate-900">
                  {confirmedBooking.date} @ {confirmedBooking.startTime} - {confirmedBooking.endTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Payment Type:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.paymentType}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1">
                <span className="text-slate-700">Payment Status:</span>
                <span className={confirmedBooking.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>
                  {confirmedBooking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="view-my-dashboard-btn"
                type="button"
                onClick={() => {
                  resetBooking();
                  navigate('/dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                View My Dashboard & History
              </button>

              <button
                id="book-another-session-btn"
                type="button"
                onClick={() => {
                  resetBooking();
                  navigate('/services');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Book Another Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
