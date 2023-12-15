import React from 'react';

const BookingData = ({ bookings, onDeleteBooking, onShowBookingDetails }) => {
    const getTotalDays = (agentCounts) => {
        return Array.isArray(agentCounts) ? agentCounts.reduce((a, b) => a + b, 0) : 0;
    };

    const getAgentSelectionStatus = (booking) => {
        // Count the total number of actual agent selections made, ignoring empty strings or other placeholders
        const totalSelectionsMade = booking.agentSelection.reduce(
            (total, day) => total + day.filter(agent => agent && agent !== '').length, 0);
    
        // Use getTotalDays to calculate the total number of agent slots
        const totalAgentSlots = getTotalDays(booking.agentCounts);
    
        // Calculate the number of empty spots
        const emptyCount = totalAgentSlots - totalSelectionsMade;
    
        // Determine if the booking is full
        const isFull = emptyCount === 0;
    
        return { isFull, emptyCount };
    };
    
    const compileAgentCounts = (agentSelection) => {
        return agentSelection.flat().reduce((acc, agent) => {
            if (agent && agent !== '') {
                acc[agent] = (acc[agent] || 0) + 1;
            }
            return acc;
        }, {});
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
            {bookings.map(booking => {
                const { isFull, emptyCount } = getAgentSelectionStatus(booking);
                const agentCounts = compileAgentCounts(booking.agentSelection);

                return (
                    <div className="bg-white p-4 mb-4 rounded shadow cursor-pointer flex" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                        <div className="flex-grow">
                            <h2 className="text-lg font-bold mb-2">{booking.client}</h2>
                            {isFull ? (
                                <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white py-1 px-3 rounded-full text-sm font-bold mb-3">
                                    Booked
                                </span>
                            ) : (
                                <span className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-white py-1 px-3 rounded-full text-sm font-bold mb-3">
                                    {emptyCount} Empty
                                </span>
                            )}
                            <p className="mb-1">{booking.show}</p>
                            <p className="mb-1">{booking.startDate}</p>
                            <p className="mb-1">{booking.endDate}</p>
                            <p className="mb-3">Total Days: {getTotalDays(booking.agentCounts)}</p>
                            <button onClick={(e) => handleDelete(booking._id, e)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Delete
                            </button>
                        </div>
                        <div className="ml-4">
                            {Object.entries(agentCounts).map(([agent, count]) => (
                                <p key={agent}>{agent}: {count}</p>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingData;