import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Calendar,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  Clock,
  Heart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { slotService } from '../services/slotService';
import { Service, Slot } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { useBooking } from '../context/BookingContext';

export const LandingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { setSelectedService, setSelectedSlot, setStep } = useBooking();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [srvList, slotList] = await Promise.all([
          serviceService.getServices(),
          slotService.getSlots(),
        ]);
        setServices(srvList);
        setSlots(slotList);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStartBooking = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    navigate('/booking');
  };

  const availableSlotsCount = slots.filter((s) => s.availableSeats > 0).length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-slate-950 text-white pt-20 pb-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KineticAge Senior Mobility & Wellness Care</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Empowering Senior <span className="text-teal-400">Mobility</span>, Vitality & Fall Prevention
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Book certified senior physiotherapy, gait assessments, and balance conditioning sessions with real-time slot availability, instant confirmation, and ACID transaction safety.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  id="hero-book-now-btn"
                  to="/services"
                  className="px-7 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Book a Session</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  id="hero-check-slots-btn"
                  to="/slots"
                  className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Check 3-Day Slots</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
                <div>
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Atomic Booking Safety</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-teal-400">{availableSlotsCount}</p>
                  <p className="text-xs text-slate-400 font-medium">Slots Available</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">4.9★</p>
                  <p className="text-xs text-slate-400 font-medium">Senior Care Rating</p>
                </div>
              </div>
            </div>

            {/* Quick Hero Banner Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">ACID Guaranteed Slots</h3>
                      <p className="text-[11px] text-slate-400">Zero double booking concurrency lock</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                    Live
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Senior Physiotherapy</span>
                    <span className="text-teal-400 font-bold">45 mins • ₹75</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Fall Prevention Program</span>
                    <span className="text-teal-400 font-bold">60 mins • ₹90</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Mobility Assessment</span>
                    <span className="text-teal-400 font-bold">30 mins • ₹50</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/slots"
                    className="w-full py-3 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View All 3-Day Slots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Senior Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-1 block">
              Tailored Senior Programs
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Our Core Wellness & Therapy Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 group"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-200/60 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelectService={handleStartBooking}
                onViewDetails={() => navigate(`/services/${service.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why KineticAge Features Section */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-3">Designed Exclusively for Senior Safety & Comfort</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every detail of KineticAge is crafted to accommodate senior mobility needs, transparent slot scheduling, and flexible payment options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">ACID Double Booking Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atomic database transactions prevent seat oversold scenarios, guaranteeing your reserved slot is 100% secured.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">3-Day Live Rolling Slots</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Slots are continuously updated for today, tomorrow, and the day after, allowing convenient scheduling.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Certified Senior Specialists</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Physiotherapists and gait experts specializing in arthritis, joint stiffness, and senior ergonomics.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Prepaid & Cash On Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay online seamlessly or opt for Cash on Delivery during your session visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-teal-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Improve Senior Mobility & Balance Today?
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              Book your first consultation or fall prevention assessment in under 60 seconds with our streamlined slot picker.
            </p>
            <div className="pt-2">
              <Link
                id="cta-get-started-btn"
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-extrabold text-sm rounded-2xl shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span>Browse Services & Slots</span>
                <ArrowRight className="w-4 h-4 text-teal-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
