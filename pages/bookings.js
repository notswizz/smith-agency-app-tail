import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BookingForm from '../components/BookingForm';
import BookingData from '../components/BookingData';
import BookingModal from '../components/BookingModal';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('/api/bookings/getBookings');
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        };
        fetchBookings();
    }, []);

    const handleBookingAdded = (newBooking) => {
        setBookings([...bookings, newBooking]);
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

    return (
        <>
            <Header />
            <div className="container">
                <BookingForm onBookingAdded={handleBookingAdded} />
                <BookingData 
                    bookings={bookings} 
                    onDeleteBooking={handleDeleteBooking} 
                    onShowBookingDetails={handleShowBookingDetails} 
                />
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
