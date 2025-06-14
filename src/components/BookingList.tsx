import React from 'react';
import { Car, Calendar, User, Phone, Mail, CreditCard } from 'lucide-react';
import { Booking } from '../types';

interface BookingListProps {
  bookings: Booking[];
}

export const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
        <p className="text-gray-500">Your car bookings will appear here once you make a reservation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        Recent Bookings
      </h3>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Car className="w-4 h-4 mr-2" />
                  {booking.carName}
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDate(booking.pickupDate)} - {formatDate(booking.dropDate)}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {booking.customerName}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {booking.customerEmail}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {booking.customerPhone}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center font-semibold text-blue-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  ${booking.totalPrice}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};