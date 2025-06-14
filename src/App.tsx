import React, { useState } from 'react';
import { Car as CarIcon, Calendar, MapPin } from 'lucide-react';
import { CarCard } from './components/CarCard';
import { DatePicker } from './components/DatePicker';
import { BookingForm } from './components/BookingForm';
import { Calendar as CalendarView } from './components/Calendar';
import { BookingList } from './components/BookingList';
import { cars } from './data/cars';
import { Car, Booking } from './types';

function App() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'book' | 'calendar' | 'bookings'>('book');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  const handleCarSelect = (car: Car) => {
    setSelectedCar(selectedCar?.id === car.id ? null : car);
  };

  const handleBookingComplete = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    setLatestBooking(booking);
    setShowConfirmation(true);
    
    // Reset form
    setSelectedCar(null);
    setPickupDate('');
    setDropDate('');
    
    // Hide confirmation after 5 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <CarIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">DriveEasy</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Self-Drive Car Rentals
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Notification */}
      {showConfirmation && latestBooking && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center">
            <CarIcon className="w-5 h-5 mr-2" />
            <div>
              <h4 className="font-semibold">Booking Confirmed!</h4>
              <p className="text-sm opacity-90">
                {latestBooking.carName} reserved for {latestBooking.totalDays} day{latestBooking.totalDays !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'book', label: 'Book a Car', icon: CarIcon },
              { key: 'calendar', label: 'Calendar View', icon: Calendar },
              { key: 'bookings', label: 'My Bookings', icon: Calendar }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
                {key === 'bookings' && bookings.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {bookings.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'book' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Perfect Ride
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose from our premium fleet of self-drive cars and experience the freedom of the road
              </p>
            </div>

            {/* Car Selection */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Car</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onSelect={handleCarSelect}
                    isSelected={selectedCar?.id === car.id}
                  />
                ))}
              </div>
            </div>

            {/* Booking Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <DatePicker
                pickupDate={pickupDate}
                dropDate={dropDate}
                onPickupDateChange={setPickupDate}
                onDropDateChange={setDropDate}
              />
              <BookingForm
                selectedCar={selectedCar}
                pickupDate={pickupDate}
                dropDate={dropDate}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Calendar</h2>
              <p className="text-lg text-gray-600">
                View all car bookings in a monthly calendar format
              </p>
            </div>
            <CalendarView bookings={bookings} />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h2>
              <p className="text-lg text-gray-600">
                Manage and view all your car reservations
              </p>
            </div>
            <BookingList bookings={bookings} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CarIcon className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">DriveEasy</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for premium self-drive car rentals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Self-Drive Rentals</li>
                <li>Long-term Leasing</li>
                <li>Corporate Bookings</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>1-800-DRIVE-EASY</li>
                <li>support@driveeasy.com</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DriveEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;