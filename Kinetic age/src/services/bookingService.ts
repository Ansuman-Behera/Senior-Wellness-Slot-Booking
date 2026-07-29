import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { apiRequest } from './api';
import { Booking, Payment } from '../types';

export const bookingService = {
  async createBooking(data: {
    serviceId: string;
    slotId: string;
    paymentType: 'Prepaid' | 'Cash on Delivery';
  }): Promise<{ booking: Booking; payment: Payment }> {
    const res = await apiRequest<{ booking: Booking; payment: Payment }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Sync booking record to Firestore
    try {
      if (res.booking) {
        const bookingRef = doc(db, 'bookings', res.booking.id);
        await setDoc(bookingRef, {
          id: res.booking.id,
          bookingId: res.booking.bookingId,
          userId: res.booking.userId,
          userName: res.booking.userName || '',
          userEmail: res.booking.userEmail || '',
          serviceId: res.booking.serviceId,
          serviceTitle: res.booking.serviceTitle,
          slotId: res.booking.slotId,
          date: res.booking.date,
          startTime: res.booking.startTime,
          endTime: res.booking.endTime,
          price: res.booking.price,
          bookingStatus: res.booking.bookingStatus,
          paymentType: res.booking.paymentType,
          paymentStatus: res.booking.paymentStatus,
          createdAt: res.booking.createdAt,
        });
      }
    } catch (firestoreErr) {
      console.warn('Firestore booking sync notice:', firestoreErr);
    }

    return res;
  },

  async getMyBookings(): Promise<Booking[]> {
    return apiRequest<Booking[]>('/api/bookings/my');
  },

  async getAllBookingsAdmin(): Promise<Booking[]> {
    return apiRequest<Booking[]>('/api/bookings/admin/all');
  },

  async cancelBooking(id: string): Promise<Booking> {
    const res = await apiRequest<Booking>(`/api/bookings/cancel/${id}`, {
      method: 'PUT',
    });

    // Sync cancellation to Firestore
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, {
        bookingStatus: 'cancelled',
        paymentStatus: res.paymentStatus || 'Refunded',
      });
    } catch (firestoreErr) {
      console.warn('Firestore cancellation sync notice:', firestoreErr);
    }

    return res;
  },
};
