import React, { useState, useEffect } from 'react';

const BookingData = ({ bookings, onDeleteBooking, onShowBookingDetails }) => {
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const fetchAgents = async () => {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
            }
        };

        fetchAgents();
    }, []);

    const compileAgentCounts = (agentSelection) => {
        const agentMap = agents.reduce((map, agent) => {
            map[agent.phone] = agent.name; // Using agent.phone as key
            return map;
        }, {});

        return agentSelection.flat().reduce((acc, agentPhone) => {
            if (agentPhone) {
                const agentName = agentMap[agentPhone] || 'Unknown Agent';
                acc[agentName] = (acc[agentName] || 0) + 1;
            }
            return acc;
        }, {});
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

    const getTotalDays = (agentCounts) => {
        return Array.isArray(agentCounts) ? agentCounts.reduce((a, b) => a + b, 0) : 0;
    };


    return (
        <div className="container mx-auto p-6 space-y-4 max-w-4xl shadow-lg rounded-xl hover:shadow-xl transition duration-500 ease-in-out bg-white" style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
        {bookings.map(booking => {
            const { isFull, emptyCount } = getAgentSelectionStatus(booking);
            const agentCounts = compileAgentCounts(booking.agentSelection);
    
            return (
                <div className="bg-white p-6 rounded-lg shadow transition duration-300 flex flex-col cursor-pointer hover:shadow-md border-l-4 border-pink-500" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">{booking.client}</h2>
                        <span className={`py-1 px-3 rounded-full text-sm font-semibold ${isFull ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                            {isFull ? 'Booked' : `${emptyCount} Empty`}
                        </span>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex-1">
                            <p className="text-lg font-medium text-gray-700">{booking.show}</p>
                            <div className="flex flex-col mt-2">
                                <span className="text-sm text-gray-500">{booking.startDate}</span>
                                <span className="text-sm text-gray-500">{booking.endDate}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-right text-lg font-medium text-gray-700">{getTotalDays(booking.agentCounts)} days</p>
                            <div className="mt-3 p-4 bg-yellow-50 rounded-lg shadow-inner relative"> 
                                <p className="text-gray-600">{booking.notes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).map(([agent, count]) => (
                            <span key={agent} className="bg-blue-100 text-black-800 text-xs font-medium px-3 py-1 rounded-full">
                                {agent}: {count}
                            </span>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
    
    );
    
    
  
    };
    
    export default BookingData;