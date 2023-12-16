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
        <div className="container mx-auto p-4 max-h-96 overflow-auto shadow border border-gray-300 rounded-lg hover:shadow-md transition duration-300">
          {bookings.map(booking => {
            const { isFull, emptyCount } = getAgentSelectionStatus(booking);
            const agentCounts = compileAgentCounts(booking.agentSelection);
            return (
              <div className="bg-white p-4 mb-4 rounded-lg shadow-sm flex flex-col cursor-pointer" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      {booking.client}
                    </h2>
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                      <p className="text-md font-medium text-gray-700">{booking.show}</p>
                      <div className="flex flex-col mt-1">
                        <span className="text-sm text-gray-500">{booking.startDate}</span>
                        <span className="text-sm text-gray-500">{booking.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      Total Days: {getTotalDays(booking.agentCounts)}
                    </p>
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  </div>
                </div>
                <span className={`self-start py-1 px-3 rounded-md text-sm font-medium my-2 shadow-sm ${isFull ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'}`}>
                  {isFull ? 'Booked' : `${emptyCount} Empty`}
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).map(([agent, count]) => (
                    <span key={agent} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                      {agent}: {count}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={(e) => handleDelete(booking._id, e)} className="ring-2 ring-red-200 bg-red-400 hover:bg-red-500 text-white font-medium py-1 px-3 rounded-full focus:outline-none focus:ring focus:ring-red-200">
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