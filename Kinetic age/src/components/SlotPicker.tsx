import React from 'react';
import { Calendar, Clock, Check, Ban, Users } from 'lucide-react';
import { Slot } from '../types';

interface SlotPickerProps {
  slots: Slot[];
  selectedDate: string;
  selectedSlot: Slot | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: Slot) => void;
  isLoading?: boolean;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
  isLoading = false,
}) => {
  // Generate 3 date options (Today, Tomorrow, Day after tomorrow)
  const today = new Date();
  const dateOptions = Array.from({ length: 3 }).map((_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() + index);
    const dateStr = d.toISOString().split('T')[0];

    const label =
      index === 0
        ? 'Today'
        : index === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short' });

    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { dateStr, label, formattedDate };
  });

  const slotsForSelectedDate = slots.filter((s) => s.date === selectedDate);

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>1. Select Preferred Date (Next 3 Days)</span>
        </label>

        <div className="grid grid-cols-3 gap-3">
          {dateOptions.map((opt) => {
            const isSelected = selectedDate === opt.dateStr;
            return (
              <button
                key={opt.dateStr}
                id={`date-tab-${opt.dateStr}`}
                type="button"
                onClick={() => onSelectDate(opt.dateStr)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`text-xs uppercase font-bold tracking-wider ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                  {opt.label}
                </span>
                <span className="text-base font-extrabold mt-0.5">{opt.formattedDate}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>2. Select Available Session Time Slot</span>
        </label>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : slotsForSelectedDate.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 font-medium">
              No slots scheduled for this date yet. Check other days or ask Admin to generate slots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slotsForSelectedDate.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isFullyBooked = slot.availableSeats <= 0 || slot.status === 'booked';
              const isDisabled = slot.status === 'disabled' || isFullyBooked;

              return (
                <button
                  key={slot.id}
                  id={`slot-btn-${slot.id}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectSlot(slot)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-slate-900/20'
                      : isDisabled
                      ? 'bg-slate-100/70 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-teal-500 hover:bg-teal-50/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-extrabold text-sm mb-1">
                    {slot.startTime} - {slot.endTime}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    {isFullyBooked ? (
                      <span className="text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        <Ban className="w-3 h-3" /> Fully Booked
                      </span>
                    ) : isDisabled ? (
                      <span className="text-slate-400">Unavailable</span>
                    ) : (
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-teal-500/30 text-teal-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        <Users className="w-3 h-3" /> {slot.availableSeats} seat{slot.availableSeats > 1 ? 's' : ''} left
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-teal-500 text-white p-1 rounded-full shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
