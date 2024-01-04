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
            map[agent._id] = agent.name; // Assuming each agent has _id and name
            return map;
        }, {});

        return agentSelection.flat().reduce((acc, agentId) => {
            if (agentId) {
                const agentName = agentMap[agentId] || 'Unknown Agent';
                acc[agentName] = (acc[agentName] || 0) + 1;
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
        <div className="container mx-auto p-6 max-h-96 overflow-auto shadow-lg border border-gray-400 rounded-xl hover:shadow-xl transition duration-500 ease-in-out">
            <div className="grid md:grid-cols-2 gap-6">
                {bookings.map(booking => {
                    const { isFull, emptyCount } = getAgentSelectionStatus(booking);
                    const agentCounts = compileAgentCounts(booking.agentSelection);
    
                    return (
                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition duration-300 flex flex-col cursor-pointer" key={booking._id} onClick={() => onShowBookingDetails(booking)}>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-2xl font-semibold text-gray-900">{booking.client}</h2>
                                
                                <span className={`py-2 px-4 rounded-md text-sm font-semibold shadow ${isFull ? 'bg-green-600 text-white' : 'bg-yellow-600 text-gray-100'}`}>
                                    {isFull ? 'Booked' : `${emptyCount} Empty`}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="mb-5 md:mb-0">
                                    <div className="p-3 bg-gray-100 border border-gray-300 rounded-xl shadow-inner">
                                        <p className="text-lg font-medium text-gray-800">{booking.show}</p>
                                        <div className="flex flex-col mt-2">
                                            <span className="text-sm text-gray-600">{booking.startDate}</span>
                                            <span className="text-sm text-gray-600">{booking.endDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-md font-medium text-gray-800">{getTotalDays(booking.agentCounts)} days</p>
                                    <div className="mt-3 p-4 bg-yellow-200 border border-yellow-300 rounded-xl shadow-inner relative"> 
                                        <p className="text-md text-gray-800">{booking.notes}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3">
                                {Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).map(([agent, count]) => (
                                    <span key={agent} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-full">
                                        {agent}: {count}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-5 flex justify-end">
                                <button onClick={(e) => handleDelete(booking._id, e)} className="ring-2 ring-red-300 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-red-300 transition duration-300">
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    

  
  
  
  
    };
    
    export default BookingData;