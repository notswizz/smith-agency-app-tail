import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import BookingForm from '../components/booking/BookingForm';
import BookingData from '../components/booking/BookingData';
import BookingModal from '../components/booking/BookingModal';
import BookingFilters from '../components/booking/BookingFilters';


const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]); // To store all bookings
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('/api/bookings/getBookings');
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
                setAllBookings(data); // Store all bookings
            }
        };
        fetchBookings();
    }, []);

    const handleBookingAdded = (newBooking) => {
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        setAllBookings(updatedBookings);
    };

    const handleUpdateBooking = async (updatedBooking) => {
        // Update booking in database
        const response = await fetch(`/api/bookings/updateBooking/${updatedBooking._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBooking),
        });

        if (response.ok) {
            // Update state
            const updatedBookings = bookings.map(booking => 
                booking._id === updatedBooking._id ? updatedBooking : booking
            );
            setBookings(updatedBookings);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
  // Ask user to confirm the deletion
  if (window.confirm('Are you sure you want to delete this booking?')) {
    // If confirmed, proceed with the deletion
    const response = await fetch(`/api/bookings/deleteBooking/${bookingId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Update state after successful deletion
      const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
      setBookings(updatedBookings);
      alert('Booking deleted successfully.');
    } else {
      // Handle any errors
      alert('Failed to delete booking.');
    }
  } else {
    // If not confirmed, do nothing
    console.log('Deletion cancelled by user.');
  }
};


    const handleShowBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setModalVisible(true);
    };

    const handleFilterChange = (filters) => {
        // Filter the bookings based on the criteria
        const filteredBookings = allBookings.filter(booking => 
            (filters.client ? booking.client.includes(filters.client) : true) &&
            (filters.show ? booking.show.includes(filters.show) : true)
        );
        setBookings(filteredBookings);
    };

    

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                {/* Main layout with Flexbox */}
                <div className="flex flex-row">
                    
                    {/* Container for the button and filters */}
                    <div className="w-1/4 flex flex-col space-y-4 mb-4">
                        <button 
                            onClick={toggleFormVisibility}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {isFormVisible ? 'Hide Form' : 'Add New Booking'}
                        </button>
    
                        {!isFormVisible && (
                            <BookingFilters onFilterChange={handleFilterChange} />
                        )}
                    </div>
    
                    {/* Conditional rendering of BookingForm or BookingData with added margin */}
                    <div className={`flex-1 ${isFormVisible ? '' : 'ml-8'}`}>
                        {isFormVisible ? (
                            <BookingForm onBookingAdded={handleBookingAdded} />
                        ) : (
                            <BookingData 
                                bookings={bookings} 
                                onDeleteBooking={handleDeleteBooking} 
                                onShowBookingDetails={handleShowBookingDetails} 
                            />
                        )}
                    </div>
                </div>
    
                {modalVisible && 
                    <BookingModal 
                        booking={selectedBooking} 
                        onClose={() => setModalVisible(false)}
                        onUpdateBooking={handleUpdateBooking} 
                    />
                }
            </div>
        </>
    );
    
    
    
    
};

export default BookingsPage;