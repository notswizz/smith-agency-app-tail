import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BookingForm from '../components/BookingForm';
import BookingData from '../components/BookingData';
import Modal from '../components/BookingModal'; // Import the Modal component
import { loadData, saveData } from '../lib/storage';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        setBookings(loadData('bookings'));
    }, []);

    const handleBookingAdded = (newBooking) => {
        const updatedBookings = [...bookings, newBooking];
        saveData('bookings', updatedBookings);
        setBookings(updatedBookings);
    };

    const handleUpdateBooking = (updatedBooking) => {
        const updatedBookings = bookings.map(booking => 
            booking.id === updatedBooking.id ? updatedBooking : booking
        );
        saveData('bookings', updatedBookings);
        setBookings(updatedBookings);
    };

    const handleDeleteBooking = (bookingId) => {
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        saveData('bookings', updatedBookings);
        setBookings(updatedBookings);
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
                    <Modal 
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
