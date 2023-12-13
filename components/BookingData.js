import React from 'react';

const BookingData = ({ bookings, onDeleteBooking, onShowBookingDetails }) => {
    const getTotalDays = (agentCounts) => {
        return Array.isArray(agentCounts) ? agentCounts.reduce((a, b) => a + b, 0) : 0;
    };

    const handleDelete = async (id, event) => {
        event.stopPropagation();
        const response = await fetch(`/api/bookings/deleteBooking?id=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            onDeleteBooking(id);
        } else {
            console.error('Failed to delete booking');
        }
    };

    return (
        <div className="data-container">
            {bookings.map(booking => (
                <div className="data-item" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                    <h3>{booking.client}</h3>
                    <p>{booking.show}</p>
                    <p>{booking.startDate}</p>
                    <p>{booking.endDate}</p>
                    <p>Total Days: {getTotalDays(booking.agentCounts)}</p>
                    <button onClick={(e) => handleDelete(booking._id, e)} className="delete-button">Delete</button>
                </div>
            ))}
        </div>
    );
};

export default BookingData;
