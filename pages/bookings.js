import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import BookingForm from '../components/booking/BookingForm';
import BookingData from '../components/booking/BookingData';
import BookingModal from '../components/booking/BookingModal';
import BookingFilters from '../components/booking/BookingFilters';
import withPasswordProtection from '../lib/withPasswordProtection';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [filteredCount, setFilteredCount] = useState(0); // State for the count of filtered bookings
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('/api/bookings/getBookings');
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
                setAllBookings(data);
                setFilteredCount(data.length); // Initialize with total count
            }
        };
        fetchBookings();
    }, []);

    const handleBookingAdded = (newBooking) => {
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        setAllBookings(updatedBookings);
        setFilteredCount(updatedBookings.length); // Update count
    };

    const handleUpdateBooking = async (updatedBooking) => {
        // Update booking in database
        console.log('Updating Booking with ID:', updatedBooking._id); // Added console log
        const response = await fetch(`/api/bookings/updateBooking/${updatedBooking._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBooking),
        });
    
        console.log('Update Booking Response Status:', response.status); // Added console log
    
        if (response.ok) {
            const updatedBookings = bookings.map(booking => 
                booking._id === updatedBooking._id ? updatedBooking : booking
            );
            setBookings(updatedBookings);
            setFilteredCount(updatedBookings.length); // Update count
        }
    };
    
    

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            const response = await fetch(`/api/bookings/deleteBooking/${bookingId}`, { method: 'DELETE' });
            if (response.ok) {
                const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
                setBookings(updatedBookings);
                setFilteredCount(updatedBookings.length); // Update count
            } else {
                alert('Failed to delete booking.');
            }
        }
    };

    const handleShowBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setModalVisible(true);
    };

    const handleFilterChange = (filters) => {
        const filteredBookings = allBookings.filter(booking => {
            const clientLower = booking.client?.toLowerCase() || '';
            const showLower = booking.show?.toLowerCase() || '';
            const filterClientLower = filters.client?.toLowerCase() || '';
            const filterShowLower = filters.show?.toLowerCase() || '';

            const matchesClientAndShow = (!filters.client || clientLower.includes(filterClientLower)) &&
                                         (!filters.show || showLower.includes(filterShowLower));

            let matchesBookingStatus = true;
            if (filters.bookingStatus) {
                if (filters.bookingStatus === 'booked') {
                    matchesBookingStatus = booking.agentSelection?.every(daySelection => 
                        daySelection.every(selection => selection !== "")
                    );
                } else if (filters.bookingStatus === 'open') {
                    matchesBookingStatus = booking.agentSelection?.some(daySelection => 
                        daySelection.some(selection => selection === "")
                    );
                }
            }

            return matchesClientAndShow && matchesBookingStatus;
        });

        setBookings(filteredBookings);
        setFilteredCount(filteredBookings.length); // Update the count based on filtered bookings
    };

    
    

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 mt-6">
                {/* Responsive layout with Flexbox */}
                <div className="flex flex-col md:flex-row">
                    
                    {/* Container for the button and filters */}
                    <div className="md:w-1/4 flex flex-col space-y-4 mb-4 md:mb-0">
                        <button 
                            onClick={toggleFormVisibility}
                            className="bg-black hover:bg-pink text-white font-bold py-2 px-4 rounded"
                        >
                            {isFormVisible ? 'Hide Form' : 'Add New Booking'}
                        </button>
    
                        {!isFormVisible && (
                             <BookingFilters 
                             onFilterChange={handleFilterChange}
                             filteredCount={filteredCount} // Pass the count
                         />
                        )}
                    </div>
    
                    {/* Conditional rendering of BookingForm or BookingData with responsive margin */}
                    <div className={`flex-1 ${isFormVisible ? '' : 'md:ml-8'}`}>
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

const ProtectedBookingsPage = withPasswordProtection(BookingsPage, 'swizz');
export default ProtectedBookingsPage;