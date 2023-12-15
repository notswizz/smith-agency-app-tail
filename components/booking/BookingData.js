import React from 'react';

const BookingData = ({ bookings, onDeleteBooking, onShowBookingDetails }) => {
    const getTotalDays = (agentCounts) => {
        return Array.isArray(agentCounts) ? agentCounts.reduce((a, b) => a + b, 0) : 0;
    };

    const getAgentSelectionStatus = (booking) => {
        const totalSelectionsMade = booking.agentSelection.reduce(
            (total, day) => total + day.filter(agent => agent).length, 0
        );
        const totalAgentSlots = getTotalDays(booking.agentCounts);
        const emptyCount = totalAgentSlots - totalSelectionsMade;
        const isFull = emptyCount === 0;
        return { isFull, emptyCount };
    };

    const compileAgentCounts = (agentSelection) => {
        return agentSelection.flat().reduce((acc, agent) => {
            if (agent) {
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
                    <div className="bg-white p-4 mb-4 rounded-lg shadow-lg flex flex-col cursor-pointer" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold text-gray-800">{booking.client}</h2>
                            <p className="inline-block bg-black text-white text-sm font-semibold px-3 py-1 rounded-full">
                                Total Days: {getTotalDays(booking.agentCounts)}
                            </p>
                        </div>
                        <div className="my-2 p-2 bg-gray-100 rounded">
                            <p className="text-md text-gray-700">{booking.show}</p>
                            <p className="text-md text-gray-600">{booking.startDate} - {booking.endDate}</p>
                        </div>
                        {isFull ? (
                            <span className="self-start bg-green-400 to-blue-500 text-white py-1 px-3 rounded-full text-sm font-bold my-2">
                                Booked
                            </span>
                        ) : (
                            <span className="self-start bg-yellow-400 to-red-500 text-white py-1 px-3 rounded-full text-sm font-bold my-2">
                                {emptyCount} Empty
                            </span>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).map(([agent, count]) => (
                                <span key={agent} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                    {agent}: {count}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button onClick={(e) => handleDelete(booking._id, e)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingData;
