import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Car, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Booking, CalendarDay } from '../types';

interface CalendarProps {
  bookings: Booking[];
}

export const Calendar: React.FC<CalendarProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        bookings: getBookingsForDate(dayDate)
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        bookings: getBookingsForDate(dayDate)
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        bookings: getBookingsForDate(dayDate)
      });
    }

    return days;
  };

  const getBookingsForDate = (date: Date): Booking[] => {
    return bookings.filter(booking => {
      const bookingStart = new Date(booking.pickupDate);
      const bookingEnd = new Date(booking.dropDate);
      
      // Check if the date falls within the booking period
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const isPickupDate = (date: Date, booking: Booking): boolean => {
    const pickupDate = new Date(booking.pickupDate);
    return date.toDateString() === pickupDate.toDateString();
  };

  const isDropDate = (date: Date, booking: Booking): boolean => {
    const dropDate = new Date(booking.dropDate);
    return date.toDateString() === dropDate.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
          Booking Calendar
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] p-2 border border-gray-100 ${
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${
              day.date.toDateString() === new Date().toDateString()
                ? 'bg-blue-50 border-blue-200'
                : ''
            }`}
          >
            <div className={`text-sm mb-1 ${
              day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            } ${
              day.date.toDateString() === new Date().toDateString()
                ? 'font-bold text-blue-600'
                : ''
            }`}>
              {day.date.getDate()}
            </div>
            
            {day.bookings.length > 0 && (
              <div className="space-y-1">
                {day.bookings.slice(0, 3).map((booking, bookingIndex) => {
                  const isPickup = isPickupDate(day.date, booking);
                  const isDrop = isDropDate(day.date, booking);
                  
                  return (
                    <div
                      key={bookingIndex}
                      className={`text-xs px-1 py-0.5 rounded flex items-center justify-between ${
                        isPickup && isDrop
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : isPickup
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : isDrop
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                      title={`${booking.carName} - ${booking.customerName}\nPickup: ${formatDateTime(booking.pickupDate)}\nDrop: ${formatDateTime(booking.dropDate)}`}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <Car className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{booking.carName}</span>
                      </div>
                      <div className="flex items-center ml-1 flex-shrink-0">
                        {isPickup && isDrop && (
                          <span className="text-xs font-bold">P→D</span>
                        )}
                        {isPickup && !isDrop && (
                          <span className="text-xs font-bold">P</span>
                        )}
                        {isDrop && !isPickup && (
                          <span className="text-xs font-bold">D</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {day.bookings.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.bookings.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
          <span>Pickup Day (P)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
          <span>Drop Day (D)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded mr-2"></div>
          <span>Same Day P→D</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
          <span>Rental Period</span>
        </div>
      </div>
    </div>
  );
};