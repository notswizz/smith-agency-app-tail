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
        <div className="container mx-auto p-4 max-h-96 overflow-auto">
            {bookings.map(booking => (
                <div className="bg-white p-4 mb-4 rounded shadow cursor-pointer" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                    <h3 className="text-lg font-bold mb-2">{booking.client}</h3>
                    <p className="mb-1">{booking.show}</p>
                    <p className="mb-1">{booking.startDate}</p>
                    <p className="mb-1">{booking.endDate}</p>
                    <p className="mb-3">Total Days: {getTotalDays(booking.agentCounts)}</p>
                    <button onClick={(e) => handleDelete(booking._id, e)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                </div>
            ))}
        </div>
    );
    
};

export default BookingData;
