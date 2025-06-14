export interface Car {
  id: string;
  name: string;
  image: string;
  type: string;
  seats: number;
  transmission: string;
  fuel: string;
  pricePerDay: number;
  features: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  pickupDate: Date;
  dropDate: Date;
  totalDays: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookings: Booking[];
}