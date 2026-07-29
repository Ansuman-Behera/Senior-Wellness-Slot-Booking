import React from 'react';
import {
  Activity,
  UserCheck,
  ShieldAlert,
  HeartHandshake,
  Scale,
  Stethoscope,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelectService?: (service: Service) => void;
  onViewDetails?: (service: Service) => void;
  isSelected?: boolean;
}

const getCategoryIcon = (category: string, iconName?: string) => {
  switch (iconName || category) {
    case 'Activity':
    case 'Physiotherapy':
      return <Activity className="w-6 h-6 text-teal-600" />;
    case 'UserCheck':
    case 'Mobility':
      return <UserCheck className="w-6 h-6 text-indigo-600" />;
    case 'ShieldAlert':
    case 'Safety':
      return <ShieldAlert className="w-6 h-6 text-amber-600" />;
    case 'HeartHandshake':
    case 'Wellness':
      return <HeartHandshake className="w-6 h-6 text-emerald-600" />;
    case 'Scale':
      return <Scale className="w-6 h-6 text-sky-600" />;
    case 'Stethoscope':
    case 'Consultation':
      return <Stethoscope className="w-6 h-6 text-rose-600" />;
    default:
      return <Sparkles className="w-6 h-6 text-teal-600" />;
  }
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Physiotherapy':
      return 'bg-teal-50 text-teal-700 border-teal-100';
    case 'Mobility':
      return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Safety':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Wellness':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Consultation':
      return 'bg-rose-50 text-rose-700 border-rose-100';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-100';
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelectService,
  onViewDetails,
  isSelected = false,
}) => {
  return (
    <div
      className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
        isSelected
          ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md bg-teal-50/10'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
            {getCategoryIcon(service.category, service.iconName)}
          </div>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClass(
              service.category
            )}`}
          >
            {service.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
          {service.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{service.duration} mins session</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{service.price}
            <span className="text-xs font-normal text-slate-400 ml-1">/ session</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              id={`view-details-${service.id}`}
              type="button"
              onClick={() => onViewDetails(service)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Details
            </button>
          )}

          {onSelectService && (
            <button
              id={`select-service-${service.id}`}
              type="button"
              onClick={() => onSelectService(service)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm group-hover:shadow flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isSelected ? 'Selected' : 'Book'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
