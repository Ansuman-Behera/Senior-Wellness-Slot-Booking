import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, Activity } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { SkeletonCard } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { useBooking } from '../context/BookingContext';

const categories = ['All', 'Physiotherapy', 'Mobility', 'Safety', 'Wellness', 'Consultation'];

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { setSelectedService, setStep } = useBooking();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && srv.active;
  });

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    navigate('/booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior Healthcare Programs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Wellness & Mobility Services</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Choose from certified senior physiotherapy, mobility assessments, and fall prevention programs. Select any program to view rolling 3-day slot availability.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="services-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service title or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Service Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={<Activity className="w-8 h-8 text-slate-400" />}
          title="No Matching Services Found"
          description="Try adjusting your category filter or search query to find available senior wellness programs."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={handleBookService}
              onViewDetails={() => navigate(`/services/${service.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
