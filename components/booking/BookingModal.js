import React, { useState, useEffect, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';

const generateDateRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    let endDate = new Date(end);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

const BookingModal = ({ booking, onClose, onUpdateBooking }) => {
    const [selectedAgents, setSelectedAgents] = useState(booking.agentSelection || []);
    const [originalBooking, setOriginalBooking] = useState(null);
    const [agentsByDate, setAgentsByDate] = useState({});
    const [allAgents, setAllAgents] = useState([]);
    const [deselectedAgents, setDeselectedAgents] = useState({});
    const [trackedChanges, setTrackedChanges] = useState({});

    // Fetch original booking data
    useEffect(() => {
        const fetchOriginalBooking = async () => {
            try {
                const response = await fetch(`/api/bookings/getBookings`);
                const bookings = await response.json();
                const originalBooking = bookings.find(b => b._id === booking._id);
                setOriginalBooking(originalBooking);
            } catch (error) {
                console.error('Error fetching original booking:', error);
            }
        };

        fetchOriginalBooking();
    }, [booking]);
  
    // Declare dateRange here
    const dateRange = useMemo(() => {
        if (booking && booking.startDate && booking.endDate) {
            const startDate = new Date(toUTCDateString(booking.startDate));
            const endDate = new Date(toUTCDateString(booking.endDate));
            return generateDateRange(startDate, endDate);
        }
        return [];
    }, [booking]);

    useEffect(() => {
        if (!booking) return;

        const fetchAgentsForAllDates = async () => {
            const agentsForDates = {};
            for (const date of dateRange) {
                const formattedDate = toUTCDateString(date);
                try {
                    const response = await fetch(`/api/agents/getAvailAgents?date=${formattedDate}`);
                    const data = await response.json();
                    agentsForDates[formattedDate] = response.ok ? data : [];
                } catch (error) {
                    console.error(`Error fetching agents for ${formattedDate}:`, error);
                }
            }
            setAgentsByDate(agentsForDates);
        };

        fetchAgentsForAllDates();
    }, [booking, dateRange]);

    useEffect(() => {
        const fetchAllAgents = async () => {
            try {
                const response = await fetch('/api/agents/getAgents');
                const data = await response.json();
                setAllAgents(data);
            } catch (error) {
                console.error('Error fetching all agents:', error);
            }
        };

        fetchAllAgents();
    }, []);

    const phoneToNameMap = useMemo(() => {
        const map = {};
        allAgents.forEach(agent => {
            map[agent.phone] = agent.name;
        });
        return map;
    }, [allAgents]);

   
    
   
    const handleAgentSelection = (dayIndex, agentIndex, agentPhone) => {
        setSelectedAgents((prevSelectedAgents) => {
            const updatedAgents = [...prevSelectedAgents];
            const previousAgentPhone = updatedAgents[dayIndex][agentIndex];
            updatedAgents[dayIndex][agentIndex] = agentPhone;
        
            // If the agent selection has changed, update trackedChanges
            if (previousAgentPhone !== agentPhone) {
                const date = toUTCDateString(dateRange[dayIndex]);
    
                // Deselection of previous agent
                if (previousAgentPhone) {
                    const prevAgent = allAgents.find(a => a.phone === previousAgentPhone);
                    const prevAvailabilityEntry = prevAgent?.availability.find(a => a.date === date);
    
                    setTrackedChanges(prev => ({
                        ...prev,
                        [`${date}-${prevAvailabilityEntry?.id}`]: {
                            agentPhone: previousAgentPhone,
                            availabilityId: prevAvailabilityEntry?.id,
                            status: 'open'
                        }
                    }));
                }
    
                // Selection of new agent
                if (agentPhone) {
                    const newAgent = allAgents.find(a => a.phone === agentPhone);
                    const newAvailabilityEntry = newAgent?.availability.find(a => a.date === date);
    
                    setTrackedChanges(prev => ({
                        ...prev,
                        [`${date}-${newAvailabilityEntry?.id}`]: {
                            agentPhone,
                            availabilityId: newAvailabilityEntry?.id,
                            status: 'booked'
                        }
                    }));
                }
            }
    
            return updatedAgents;
        });
    };
    
    
    

    const handleSaveSelection = async () => {
        const requests = [];
    
        // Iterate over trackedChanges
        for (const changeKey in trackedChanges) {
            if (trackedChanges.hasOwnProperty(changeKey)) {
                const change = trackedChanges[changeKey];
                requests.push({
                    agentPhone: change.agentPhone,
                    availabilityId: change.availabilityId,
                    status: change.status
                });
            }
        }
    
        // Send the requests
        try {
            await Promise.all(requests.map(req => {
                return fetch('/api/availability/modifyAvailability', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                });
            }));
    
            // Update the booking and close the modal
            const updatedBooking = { ...booking, agentSelection: selectedAgents };
            onUpdateBooking(updatedBooking);
            onClose();
        } catch (error) {
            console.error('Error updating agent availability:', error);
        }
    };
    
     // Function to handle the deletion of a booking
     const handleDeleteBooking = async () => {
        if (!booking || !booking._id) return;
        
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/bookings/deleteBooking?id=${booking._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Call a function passed via props to update the parent component
                // This function should remove the deleted booking from the state
                onClose(); // Close the modal after deletion
            } else {
                console.error('Failed to delete booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };
    
    
    
    const renderAgentDropdown = (dayIndex, agentIndex, selectedAgentPhone, date) => {
        const formattedDate = toUTCDateString(date);
        const agentsForThisDate = agentsByDate[formattedDate] || [];
    
        return (
            <select
                value={selectedAgentPhone || ''}
                onChange={(e) => handleAgentSelection(dayIndex, agentIndex, e.target.value)}
            >
                {selectedAgentPhone && (
                    <option value={selectedAgentPhone} key={`selected-${selectedAgentPhone}`}>
                        {phoneToNameMap[selectedAgentPhone]}
                    </option>
                )}
                {!selectedAgentPhone && (
                    <option value="" key={`default-${dayIndex}-${agentIndex}`}>Select Agent</option>
                )}
                {agentsForThisDate.map((agent) => {
                    // Find the matching availability entry for the date
                    const availabilityEntry = agent.availability.find(a => a.date === formattedDate);
                    return (
                        <option key={availabilityEntry.id} value={agent.phone}>
                            {phoneToNameMap[agent.phone] || agent.name}
                        </option>
                    );
                })}
            </select>
        );
    };
    
   
    
    

    const renderRowForDate = (date, agentsForDay, dayIndex) => {
        const MAX_AGENTS_PER_ROW = 3;
        const rows = [];
        for (let i = 0; i < agentsForDay.length; i += MAX_AGENTS_PER_ROW) {
            const agentsInRow = agentsForDay.slice(i, i + MAX_AGENTS_PER_ROW);
            rows.push(
                <tr key={`day-${dayIndex}-row-${i / MAX_AGENTS_PER_ROW}`}>
                    {agentsInRow.map((agentId, agentIndex) => (
                        <td key={`agent-${agentIndex}`}>
                            {renderAgentDropdown(dayIndex, i + agentIndex, agentId, date)}
                        </td>
                    ))}
                </tr>
            );
        }
        return rows;
    };

    const bookingInfoHeader = () => {
        const startDate = booking && new Date(toUTCDateString(booking.startDate));
        const endDate = booking && new Date(toUTCDateString(booking.endDate));
        if (booking && startDate && endDate) {
            return (
                <tr className="bg-gray-50">
                    <th colSpan="100%" className="py-2 px-4 text-left text-gray-700">
                        {booking.show} - {booking.client} - {startDate.toISOString().split('T')[0]} -- {endDate.toISOString().split('T')[0]}
                    </th>
                </tr>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4">
                 {/* Positioned Delete Button */}
                 <button 
                    className="absolute top-0 right-0 mt-4 mr-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 text-sm rounded focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
                    onClick={handleDeleteBooking}
                >
                    Delete
                </button>
                <span className="close text-gray-700 text-2xl leading-none hover:text-gray-500 cursor-pointer" onClick={onClose}>&times;</span>
                <div className="mt-4">
                     
                    <table className="min-w-full border-collapse border border-gray-300">

                        <thead>
                            {bookingInfoHeader()}
                        </thead>
                        <tbody>
                            {selectedAgents.map((agentsForDay, dayIndex) => (
                                <React.Fragment key={dayIndex}>
                                    {dayIndex > 0 && <tr className="border-t-2 border-blue-200"><td colSpan="100%"></td></tr>}
                                    {renderRowForDate(dateRange[dayIndex], agentsForDay, dayIndex)}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" onClick={handleSaveSelection}>Save Selection</button>
        

                </div>
            </div>
        </div>
    );
};

export default BookingModal;
