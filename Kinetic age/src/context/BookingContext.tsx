import React, { createContext, useContext, useState } from 'react';
import { Service, Slot, PaymentType } from '../types';

interface BookingState {
  selectedService: Service | null;
  selectedDate: string;
  selectedSlot: Slot | null;
  paymentType: PaymentType;
  step: number;
}

interface BookingContextType {
  state: BookingState;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: Slot | null) => void;
  setPaymentType: (type: PaymentType) => void;
  setStep: (step: number) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const todayStr = new Date().toISOString().split('T')[0];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BookingState>({
    selectedService: null,
    selectedDate: todayStr,
    selectedSlot: null,
    paymentType: 'Prepaid',
    step: 1,
  });

  const setSelectedService = (service: Service | null) => {
    setState((prev) => ({ ...prev, selectedService: service, selectedSlot: null }));
  };

  const setSelectedDate = (date: string) => {
    setState((prev) => ({ ...prev, selectedDate: date, selectedSlot: null }));
  };

  const setSelectedSlot = (slot: Slot | null) => {
    setState((prev) => ({ ...prev, selectedSlot: slot }));
  };

  const setPaymentType = (paymentType: PaymentType) => {
    setState((prev) => ({ ...prev, paymentType }));
  };

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const resetBooking = () => {
    setState({
      selectedService: null,
      selectedDate: todayStr,
      selectedSlot: null,
      paymentType: 'Prepaid',
      step: 1,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        setSelectedService,
        setSelectedDate,
        setSelectedSlot,
        setPaymentType,
        setStep,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
