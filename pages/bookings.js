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
        // Delete booking from database
        const response = await fetch(`/api/bookings/deleteBooking/${bookingId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Update state
            const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
            setBookings(updatedBookings);
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

    return (
        <>
            <Header />
            <div className="container">
                <BookingForm onBookingAdded={handleBookingAdded} />
                <div className="filters-and-data-container"> {/* New container for filters and data */}
                    <div className="filters-container"> {/* Filters are now beside each other */}
                        <BookingFilters onFilterChange={handleFilterChange} />
                    </div>
                    <BookingData 
                        bookings={bookings} 
                        onDeleteBooking={handleDeleteBooking} 
                        onShowBookingDetails={handleShowBookingDetails} 
                    />
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