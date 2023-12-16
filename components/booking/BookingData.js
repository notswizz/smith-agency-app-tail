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
        <div className="container mx-auto p-4 max-h-96 overflow-auto shadow border border-pink-400 rounded-lg hover:shadow-lg hover:border-pink-500 transition duration-300">
            {bookings.map(booking => {
                const { isFull, emptyCount } = getAgentSelectionStatus(booking);
                const agentCounts = compileAgentCounts(booking.agentSelection);
                return (
                    <div className="bg-white p-4 mb-4 rounded-lg shadow-lg flex flex-col cursor-pointer" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                                    {booking.client}
                                </h2>
                                <div className="my-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                                    <p className="text-lg font-semibold text-gray-700">{booking.show}</p>
                                    <div className="flex flex-col">
                                        <span className="text-md text-gray-600">{booking.startDate}</span>
                                        <span className="text-md text-gray-600">{booking.endDate}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="inline-block bg-black text-white text-sm font-semibold px-3 py-1 rounded-full">
                                    Total Days: {getTotalDays(booking.agentCounts)}
                                </p>
                                <div className="mt-4 p-4 bg-yellow-200 border border-yellow-400 rounded shadow-lg">
                                    <p className="text-sm text-gray-800 font-medium whitespace-pre-line">{booking.notes}</p>
                                </div>
                            </div>
                        </div>
                        {isFull ? (
                            <span className="self-start bg-green-400 text-white py-2 px-4 rounded-md text-base font-bold my-2 shadow">
                                Booked
                            </span>
                        ) : (
                            <span className="self-start bg-yellow-400 text-white py-2 px-4 rounded-md text-base font-bold my-2 shadow">
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
                        <div className="mt-4 flex justify-end">
                            <button onClick={(e) => handleDelete(booking._id, e)} className="ring-2 ring-red-300 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-4 focus:ring-red-300">
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
