export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  age?: number;
  emergencyContact?: string;
  createdAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  price: number; // in INR or USD
  active: boolean;
  category: 'Physiotherapy' | 'Mobility' | 'Safety' | 'Wellness' | 'Consultation';
  iconName?: string;
  imageUrl?: string;
}

export type SlotStatus = 'available' | 'booked' | 'disabled';

export interface Slot {
  id: string;
  serviceId: string;
  serviceTitle?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  status: SlotStatus;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';
export type PaymentType = 'Prepaid' | 'Cash on Delivery';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface Booking {
  id: string;
  bookingId: string; // Custom alphanumeric string e.g., KA-84920
  userId: string;
  userName?: string;
  userEmail?: string;
  serviceId: string;
  serviceTitle: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  bookingStatus: BookingStatus;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentType;
  paymentStatus: PaymentStatus;
  transactionRef: string;
  createdAt: string;
}

export interface UserDashboardStats {
  upcomingBookingsCount: number;
  pastBookingsCount: number;
  totalSpent: number;
  activeBookings: Booking[];
  pastBookings: Booking[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalBookings: number;
  todaysBookings: number;
  totalRevenue: number;
  slotUtilizationRate: number; // Percentage
  recentBookings: Booking[];
}
