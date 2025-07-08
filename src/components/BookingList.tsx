import React, { useState, useEffect } from 'react';
import { Car, Calendar, User, Phone, Mail, CreditCard, MoreVertical, Trash2, Edit, Search } from 'lucide-react';
import { Booking } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ApiBooking, getBookings } from '../services/api';  

interface BookingListProps {
  bookings: Booking[];
  loading?: boolean;
  onUpdateStatus?: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  loading = false,
  onUpdateStatus,
  onDelete 
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [phoneFilter, setPhoneFilter] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      booking.customerPhone.includes(phoneFilter)
    );
    setFilteredBookings(filtered);
  }, [phoneFilter, bookings]);

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

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    if (!onUpdateStatus) return;
    
    try {
      setActionLoading(id);
      await onUpdateStatus(id, status);
      setOpenDropdown(null);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setActionLoading(id);
        await onDelete(id);
        setOpenDropdown(null);
      } catch (error) {
        console.error('Failed to delete booking:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <LoadingSpinner size="lg" text="Loading bookings..." />
      </div>
    );
  }

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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Recent Bookings
        </h3>
        <div className="relative">
          <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by phone number"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {phoneFilter ? 'No bookings found for this phone number' : 'No Bookings Yet'}
          </h3>
          <p className="text-gray-500">
            {phoneFilter 
              ? 'Try searching with a different phone number'
              : 'Your car bookings will appear here once you make a reservation.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
         
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    {(onUpdateStatus || onDelete) && (
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === booking.id ? null : booking.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          disabled={actionLoading === booking.id}
                        >
                          {actionLoading === booking.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        
                        {openDropdown === booking.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            {onUpdateStatus && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Mark as Confirmed
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'pending')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Mark as Pending
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Mark as Cancelled
                                </button>
                              </>
                            )}
                            {onDelete && (
                              <>
                                {onUpdateStatus && <hr className="my-1" />}
                                <button
                                  onClick={() => handleDelete(booking.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Booking
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}