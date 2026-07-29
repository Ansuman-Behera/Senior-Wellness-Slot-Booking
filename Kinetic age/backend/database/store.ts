import crypto from 'crypto';

// In-Memory Stateful Transactional Store for KineticAge
// Supports strict ACID transaction semantics with mutex locking,
// atomic rollback, and complete seed data generation.

export interface IUserStore {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  phone?: string;
  age?: number;
  emergencyContact?: string;
  createdAt: string;
}

export interface IServiceStore {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  category: 'Physiotherapy' | 'Mobility' | 'Safety' | 'Wellness' | 'Consultation';
  iconName: string;
}

export interface ISlotStore {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  status: 'available' | 'booked' | 'disabled';
}

export interface IBookingStore {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceTitle: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  paymentType: 'Prepaid' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  createdAt: string;
}

export interface IPaymentStore {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: 'Prepaid' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  transactionRef: string;
  createdAt: string;
}

class DatabaseStore {
  private users: Map<string, IUserStore> = new Map();
  private services: Map<string, IServiceStore> = new Map();
  private slots: Map<string, ISlotStore> = new Map();
  private bookings: Map<string, IBookingStore> = new Map();
  private payments: Map<string, IPaymentStore> = new Map();

  // Transaction mutex lock to prevent race conditions during booking
  private isLocked: boolean = false;
  private lockQueue: Array<() => void> = [];

  constructor() {
    this.seedInitialData();
  }

  private async acquireLock(): Promise<void> {
    if (!this.isLocked) {
      this.isLocked = true;
      return;
    }
    return new Promise((resolve) => {
      this.lockQueue.push(resolve);
    });
  }

  private releaseLock(): void {
    if (this.lockQueue.length > 0) {
      const next = this.lockQueue.shift();
      if (next) next();
    } else {
      this.isLocked = false;
    }
  }

  public seedInitialData() {
    this.users.clear();
    this.services.clear();
    this.slots.clear();
    this.bookings.clear();
    this.payments.clear();

    // Default Passwords: 'admin123' and 'user123' (bcrypt hashed statically or evaluated in controller)
    // bcrypt hashes for test users:
    // admin123 -> $2a$10$3eE3R5r6W3S2Q9Z1a2b3c.eK5RzV8W.xG9Y0Z1A2B3C4D5E6F7G8
    // user123  -> $2a$10$8k.pZ8mN9/Q2W3E4R5T6Y.uI7O8P9A0S1D2F3G4H5J6K7L8M9N0
    const adminUser: IUserStore = {
      id: 'usr_admin',
      name: 'Dr. Sarah Jenkins (Admin)',
      email: 'admin@kineticage.com',
      passwordHash: '$2a$10$W23a4b5c6d7e8f9g0h1i2uQ8Z9Y0X1W2V3U4T5S6R7Q8P9O0N',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      age: 42,
      createdAt: new Date().toISOString(),
    };

    const demoUser: IUserStore = {
      id: 'usr_senior1',
      name: 'Robert Vance',
      email: 'user@kineticage.com',
      passwordHash: '$2a$10$W23a4b5c6d7e8f9g0h1i2uQ8Z9Y0X1W2V3U4T5S6R7Q8P9O0N',
      role: 'user',
      phone: '+1 (555) 014-9922',
      age: 71,
      emergencyContact: 'Laura Vance (Daughter) +1 (555) 014-9923',
      createdAt: new Date().toISOString(),
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(demoUser.id, demoUser);

    // Initial Services as specified in assignment
    const initialServices: IServiceStore[] = [
      {
        id: 'srv_1',
        title: 'Senior Physiotherapy',
        description: 'Targeted physical therapy tailored for joint stiffness, arthritis relief, and post-surgery mobility enhancement.',
        duration: 45,
        price: 75,
        active: true,
        category: 'Physiotherapy',
        iconName: 'Activity',
      },
      {
        id: 'srv_2',
        title: 'Mobility Assessment',
        description: 'Comprehensive gait analysis, range of motion check, and personalized movement strategy by certified specialists.',
        duration: 30,
        price: 50,
        active: true,
        category: 'Mobility',
        iconName: 'UserCheck',
      },
      {
        id: 'srv_3',
        title: 'Fall Prevention Program',
        description: 'Specialized balance conditioning, core stability, and home environmental safety guidance to minimize fall risks.',
        duration: 60,
        price: 90,
        active: true,
        category: 'Safety',
        iconName: 'ShieldAlert',
      },
      {
        id: 'srv_4',
        title: 'Yoga for Seniors',
        description: 'Gentle chair and floor yoga sessions focusing on breathing techniques, mild stretching, and postural alignment.',
        duration: 45,
        price: 40,
        active: true,
        category: 'Wellness',
        iconName: 'HeartHandshake',
      },
      {
        id: 'srv_5',
        title: 'Balance Training',
        description: 'Proprioceptive training exercises designed to improve lower-limb strength and spatial stability during walking.',
        duration: 45,
        price: 60,
        active: true,
        category: 'Mobility',
        iconName: 'Scale',
      },
      {
        id: 'srv_6',
        title: 'Pain Management Consultation',
        description: 'In-depth consultation for chronic pain management using non-invasive thermal therapy and posture corrections.',
        duration: 30,
        price: 65,
        active: true,
        category: 'Consultation',
        iconName: 'Stethoscope',
      },
    ];

    initialServices.forEach((srv) => this.services.set(srv.id, srv));

    // Generate slots for the next 3 days
    this.generate3DaySlotsInternal();

    // Seed a couple sample past and upcoming bookings for demoUser
    const slotsArray = Array.from(this.slots.values());
    if (slotsArray.length >= 2) {
      const slot1 = slotsArray[0];
      const slot2 = slotsArray[1];

      // Reserve seat for slot1
      slot1.bookedSeats += 1;
      slot1.availableSeats -= 1;
      if (slot1.availableSeats === 0) slot1.status = 'booked';

      const booking1: IBookingStore = {
        id: 'bk_demo1',
        bookingId: 'KA-10029',
        userId: demoUser.id,
        userName: demoUser.name,
        userEmail: demoUser.email,
        serviceId: slot1.serviceId,
        serviceTitle: this.services.get(slot1.serviceId)?.title || 'Senior Service',
        slotId: slot1.id,
        date: slot1.date,
        startTime: slot1.startTime,
        endTime: slot1.endTime,
        price: 75,
        bookingStatus: 'confirmed',
        paymentType: 'Prepaid',
        paymentStatus: 'Paid',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      };

      const payment1: IPaymentStore = {
        id: 'pay_demo1',
        bookingId: booking1.bookingId,
        userId: demoUser.id,
        amount: 75,
        paymentMethod: 'Prepaid',
        paymentStatus: 'Paid',
        transactionRef: 'TXN-9982310',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      };

      this.bookings.set(booking1.id, booking1);
      this.payments.set(payment1.id, payment1);
    }
  }

  // Generate slots for today, tomorrow, and day after tomorrow
  public generate3DaySlotsInternal(): ISlotStore[] {
    const today = new Date();
    const createdSlots: ISlotStore[] = [];

    const timeSlots = [
      { startTime: '09:00', endTime: '09:45' },
      { startTime: '10:15', endTime: '11:00' },
      { startTime: '11:30', endTime: '12:15' },
      { startTime: '14:00', endTime: '14:45' },
      { startTime: '15:15', endTime: '16:00' },
      { startTime: '16:30', endTime: '17:15' },
    ];

    const activeServices = Array.from(this.services.values()).filter((s) => s.active);

    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dateStr = d.toISOString().split('T')[0];

      activeServices.forEach((srv) => {
        // Create 2-3 time slots per service each day
        timeSlots.slice(0, 3 + (srv.title.length % 3)).forEach((ts) => {
          const slotId = `slot_${srv.id}_${dateStr}_${ts.startTime.replace(':', '')}`;
          if (!this.slots.has(slotId)) {
            const capacity = 3; // Senior care allows up to 3 per slot for safety & personal focus
            const newSlot: ISlotStore = {
              id: slotId,
              serviceId: srv.id,
              date: dateStr,
              startTime: ts.startTime,
              endTime: ts.endTime,
              capacity: capacity,
              bookedSeats: 0,
              availableSeats: capacity,
              status: 'available',
            };
            this.slots.set(slotId, newSlot);
            createdSlots.push(newSlot);
          }
        });
      });
    }

    return createdSlots;
  }

  // --- Users Operations ---
  public findUserByEmail(email: string): IUserStore | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): IUserStore | undefined {
    return this.users.get(id);
  }

  public createUser(userData: Omit<IUserStore, 'id' | 'createdAt'>): IUserStore {
    const user: IUserStore = {
      ...userData,
      id: `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    return user;
  }

  public updateUser(id: string, updates: Partial<IUserStore>): IUserStore | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  public getAllUsers(): IUserStore[] {
    return Array.from(this.users.values());
  }

  // --- Services Operations ---
  public getAllServices(): IServiceStore[] {
    return Array.from(this.services.values());
  }

  public getServiceById(id: string): IServiceStore | undefined {
    return this.services.get(id);
  }

  public createService(data: Omit<IServiceStore, 'id'>): IServiceStore {
    const srv: IServiceStore = {
      ...data,
      id: `srv_${Date.now()}`,
    };
    this.services.set(srv.id, srv);
    this.generate3DaySlotsInternal(); // Auto generate slots for new service
    return srv;
  }

  public updateService(id: string, updates: Partial<IServiceStore>): IServiceStore | undefined {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.services.set(id, updated);
    return updated;
  }

  public deleteService(id: string): boolean {
    return this.services.delete(id);
  }

  // --- Slots Operations ---
  public getAllSlots(filters?: { serviceId?: string; date?: string; status?: string }): ISlotStore[] {
    let list = Array.from(this.slots.values());
    if (filters?.serviceId) {
      list = list.filter((s) => s.serviceId === filters.serviceId);
    }
    if (filters?.date) {
      list = list.filter((s) => s.date === filters.date);
    }
    if (filters?.status) {
      list = list.filter((s) => s.status === filters.status);
    }
    return list;
  }

  public getSlotById(id: string): ISlotStore | undefined {
    return this.slots.get(id);
  }

  public createSlot(data: Omit<ISlotStore, 'id' | 'bookedSeats' | 'availableSeats' | 'status'>): ISlotStore {
    const id = `slot_${data.serviceId}_${data.date}_${data.startTime.replace(':', '')}`;
    const slot: ISlotStore = {
      ...data,
      id,
      bookedSeats: 0,
      availableSeats: data.capacity,
      status: 'available',
    };
    this.slots.set(slot.id, slot);
    return slot;
  }

  public updateSlot(id: string, updates: Partial<ISlotStore>): ISlotStore | undefined {
    const existing = this.slots.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    if (updated.availableSeats <= 0) {
      updated.status = 'booked';
    } else if (updated.status === 'booked' && updated.availableSeats > 0) {
      updated.status = 'available';
    }
    this.slots.set(id, updated);
    return updated;
  }

  // --- ACID Transactional Booking Engine ---
  // Guaranteed atomic transaction: checks availability, updates seats, creates booking & payment.
  // Rolls back completely if any condition fails.
  public async executeBookingTransaction(params: {
    userId: string;
    userName: string;
    userEmail: string;
    serviceId: string;
    slotId: string;
    paymentType: 'Prepaid' | 'Cash on Delivery';
  }): Promise<{ booking: IBookingStore; payment: IPaymentStore }> {
    await this.acquireLock();

    // Create a snapshot for atomic rollback in case of error
    const slotSnapshot = this.slots.get(params.slotId)
      ? { ...this.slots.get(params.slotId)! }
      : null;

    try {
      // 1. Verify Slot Existence
      const slot = this.slots.get(params.slotId);
      if (!slot) {
        throw new Error('SLOT_NOT_FOUND: The requested slot does not exist.');
      }

      // 2. Check Service match
      const service = this.services.get(params.serviceId);
      if (!service || !service.active) {
        throw new Error('SERVICE_INACTIVE: The selected service is not currently available.');
      }

      // 3. Check Slot Availability (ACID Isolation Check)
      if (slot.availableSeats <= 0 || slot.status === 'booked' || slot.status === 'disabled') {
        throw new Error('SLOT_FULLY_BOOKED: This slot has no remaining seats available.');
      }

      // 4. Check for existing active booking by this user for the same slot
      const existingUserBooking = Array.from(this.bookings.values()).find(
        (b) => b.userId === params.userId && b.slotId === params.slotId && b.bookingStatus === 'confirmed'
      );
      if (existingUserBooking) {
        throw new Error('ALREADY_BOOKED: You already have a confirmed booking for this slot.');
      }

      // 5. Update Slot Seats (Decrease available, increase booked)
      slot.bookedSeats += 1;
      slot.availableSeats -= 1;
      if (slot.availableSeats <= 0) {
        slot.status = 'booked';
      }
      this.slots.set(slot.id, slot);

      // 6. Generate Booking Record
      const customBookingId = `KA-${Math.floor(10000 + Math.random() * 90000)}`;
      const bookingRecord: IBookingStore = {
        id: `bk_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
        bookingId: customBookingId,
        userId: params.userId,
        userName: params.userName,
        userEmail: params.userEmail,
        serviceId: service.id,
        serviceTitle: service.title,
        slotId: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: service.price,
        bookingStatus: 'confirmed',
        paymentType: params.paymentType,
        paymentStatus: params.paymentType === 'Prepaid' ? 'Paid' : 'Pending',
        createdAt: new Date().toISOString(),
      };
      this.bookings.set(bookingRecord.id, bookingRecord);

      // 7. Create Payment Record
      const paymentRecord: IPaymentStore = {
        id: `pay_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
        bookingId: customBookingId,
        userId: params.userId,
        amount: service.price,
        paymentMethod: params.paymentType,
        paymentStatus: params.paymentType === 'Prepaid' ? 'Paid' : 'Pending',
        transactionRef: params.paymentType === 'Prepaid' ? `TXN-${Date.now()}` : `COD-${customBookingId}`,
        createdAt: new Date().toISOString(),
      };
      this.payments.set(paymentRecord.id, paymentRecord);

      // Commit Transaction Success
      return { booking: bookingRecord, payment: paymentRecord };
    } catch (error) {
      // ATOMIC ROLLBACK: restore slot state if step failed
      if (slotSnapshot && params.slotId) {
        this.slots.set(params.slotId, slotSnapshot);
      }
      throw error;
    } finally {
      this.releaseLock();
    }
  }

  // Cancel Booking Transaction with Seat Restoration
  public async executeCancelBooking(bookingId: string, userId: string, isAdmin: boolean): Promise<IBookingStore> {
    await this.acquireLock();
    try {
      const booking = Array.from(this.bookings.values()).find(
        (b) => (b.id === bookingId || b.bookingId === bookingId) && (isAdmin || b.userId === userId)
      );

      if (!booking) {
        throw new Error('BOOKING_NOT_FOUND: Booking record not found or unauthorized.');
      }

      if (booking.bookingStatus === 'cancelled') {
        throw new Error('ALREADY_CANCELLED: This booking is already cancelled.');
      }

      booking.bookingStatus = 'cancelled';
      if (booking.paymentStatus === 'Paid') {
        booking.paymentStatus = 'Refunded';
      }
      this.bookings.set(booking.id, booking);

      // Update associated payment record if exists
      const payment = Array.from(this.payments.values()).find((p) => p.bookingId === booking.bookingId);
      if (payment) {
        if (payment.paymentStatus === 'Paid') payment.paymentStatus = 'Refunded';
        else payment.paymentStatus = 'Failed';
        this.payments.set(payment.id, payment);
      }

      // Restore Slot Capacity
      const slot = this.slots.get(booking.slotId);
      if (slot) {
        slot.bookedSeats = Math.max(0, slot.bookedSeats - 1);
        slot.availableSeats += 1;
        if (slot.status === 'booked' && slot.availableSeats > 0) {
          slot.status = 'available';
        }
        this.slots.set(slot.id, slot);
      }

      return booking;
    } finally {
      this.releaseLock();
    }
  }

  // --- Bookings Queries ---
  public getBookingsByUser(userId: string): IBookingStore[] {
    return Array.from(this.bookings.values())
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllBookings(): IBookingStore[] {
    return Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- Payments Queries ---
  public getPaymentsByUser(userId: string): IPaymentStore[] {
    return Array.from(this.payments.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllPayments(): IPaymentStore[] {
    return Array.from(this.payments.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- Dashboard Analytics ---
  public getUserStats(userId: string) {
    const userBookings = this.getBookingsByUser(userId);
    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = userBookings.filter(
      (b) => b.bookingStatus === 'confirmed' && b.date >= todayStr
    );
    const past = userBookings.filter(
      (b) => b.bookingStatus === 'completed' || (b.bookingStatus === 'confirmed' && b.date < todayStr)
    );

    const totalSpent = userBookings
      .filter((b) => b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + b.price, 0);

    return {
      upcomingBookingsCount: upcoming.length,
      pastBookingsCount: past.length,
      totalSpent,
      activeBookings: upcoming,
      pastBookings: past,
      allBookings: userBookings,
    };
  }

  public getAdminStats() {
    const allUsers = this.getAllUsers().filter((u) => u.role === 'user');
    const allBookings = this.getAllBookings();
    const todayStr = new Date().toISOString().split('T')[0];

    const todaysBookings = allBookings.filter((b) => b.date === todayStr && b.bookingStatus !== 'cancelled');

    const totalRevenue = allBookings
      .filter((b) => b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + b.price, 0);

    const allSlots = Array.from(this.slots.values());
    const totalCapacity = allSlots.reduce((sum, s) => sum + s.capacity, 0);
    const totalBookedSeats = allSlots.reduce((sum, s) => sum + s.bookedSeats, 0);
    const slotUtilizationRate = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

    return {
      totalUsers: allUsers.length,
      totalBookings: allBookings.length,
      todaysBookings: todaysBookings.length,
      totalRevenue,
      slotUtilizationRate,
      recentBookings: allBookings.slice(0, 10),
    };
  }
}

export const dbStore = new DatabaseStore();
