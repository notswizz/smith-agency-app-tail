import React, { useState, useEffect, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';
import moment from 'moment'; // Import moment

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

    // Calculate dateRange directly in the component
    let dateRange = [];
    if (booking && booking.startDate && booking.endDate) {
        const startDate = new Date(toUTCDateString(booking.startDate));
        const endDate = new Date(toUTCDateString(booking.endDate));
        dateRange = generateDateRange(startDate, endDate);

    }

    // Fetch available agents for each date in the date range
    useEffect(() => {
        const fetchAgentsForAllDates = async () => {
            const agentsForDates = {};
            for (const date of dateRange) {
                const formattedDate = moment(date).format('MMMM DD, YYYY'); // Format date for the API request
                try {
                    const response = await fetch(`/api/agents/getAvailAgents?date=${formattedDate}`);
                    if (response.ok) {
                        const data = await response.json();
                        agentsForDates[formattedDate] = data;
                    } else {
                        console.error(`Error fetching agents for ${formattedDate}:`, response.statusText);
                        agentsForDates[formattedDate] = [];
                    }
                } catch (error) {
                    console.error(`Error fetching agents for ${formattedDate}:`, error);
                    agentsForDates[formattedDate] = [];
                }
            }
            setAgentsByDate(agentsForDates);
        };

        if (dateRange.length > 0) {
            fetchAgentsForAllDates();
        }
    }, [dateRange]);


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
        try {
            // Prepare the data for the API
            const agentUpdates = []; // Array to hold updates for each agent's availability
    
            for (const changeKey in trackedChanges) {
                if (trackedChanges.hasOwnProperty(changeKey)) {
                    const change = trackedChanges[changeKey];
                    agentUpdates.push({
                        agentId: change.agentPhone, // Assuming agentPhone is used as agentId
                        availabilityId: change.availabilityId,
                        newStatus: change.status
                    });
                }
            }
    
           
    
            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error updating agent availability and booking:', error);
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
    
    
    
    const renderAgentDropdown = (dayIndex, agentIndex, selectedAgentPhone) => {
        const formattedDate = moment(dateRange[dayIndex]).format('MMMM DD, YYYY');
        const agentsForThisDate = agentsByDate[formattedDate] || [];
    
    
    
        return (
            <select
                className={`form-select ${selectedAgentPhone ? "bg-pink-200" : ""}`}
                value={selectedAgentPhone || ''}
                onChange={(e) => handleAgentSelection(dayIndex, agentIndex, e.target.value)}
            >
                <option value="" key={`default-${dayIndex}-${agentIndex}`}>
                    Select Agent
                </option>
                {agentsForThisDate.map((agent) => (
                    <option key={agent._id.$oid} value={agent.phone}>
                        {agent.name}
                    </option>
                ))}
            </select>
        );
    };
    
    
    
    const renderRowForDate = (date, agentsForDay, dayIndex) => {
        // Create sub-rows for each pair of agents
        const MAX_AGENTS_PER_ROW = 1;
        let rows = [];
        for (let i = 0; i < agentsForDay.length; i += MAX_AGENTS_PER_ROW) {
            const agentsSubset = agentsForDay.slice(i, i + MAX_AGENTS_PER_ROW);
            rows.push(
                <tr key={`date-${dayIndex}-subrow-${i}`}>
                    {i === 0 && (
                        // Only add the date cell in the first sub-row
                        <td rowSpan={Math.ceil(agentsForDay.length / MAX_AGENTS_PER_ROW)} className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {toUTCDateString(date)}
                        </td>
                    )}
                    {agentsSubset.map((agentPhone, agentIndex) => (
                        <td key={`agent-${agentIndex}`} className="px-4 py-2">
                            {renderAgentDropdown(dayIndex, i + agentIndex, agentPhone)}
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
                <tr className="bg-black">
                    <th colSpan="100%" className="py-4 px-6 text-left">
                        <div className="text-pink-600 font-bold text-xl mb-1">{booking.client}</div>
                        <div className="text-gray-500 text-sm">
                            {booking.show} <span className="text-gray-400 mx-2">|</span> 
                            <span className="font-medium">{startDate.toISOString().split('T')[0]}</span> 
                            <span className="text-gray-400 mx-1">to</span> 
                            <span className="font-medium">{endDate.toISOString().split('T')[0]}</span>
                        </div>
                    </th>
                </tr>
            );
        }
        return null;
    };
    
// Helper function to format the date
function formatDate(date) {
    // Format the date as needed
    return date.toDateString();
}
    
return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10 md:items-center">
        <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-md mx-4 md:max-w-lg lg:max-w-xl" style={{ height: '80vh', overflowY: 'auto' }}>
            {/* Delete and Close Buttons */}
            <button 
                className="absolute top-0 right-0 mt-4 mr-4 bg-red-300 hover:bg-red-700 text-white py-1 px-1 rounded-full focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
                onClick={handleDeleteBooking}
            >
                Delete
            </button>
            <button 
                className="absolute top-0 left-0 mt-4 ml-4 text-white bg-gray-800 hover:bg-gray-900 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                onClick={onClose}
            >
                &times; Close
            </button>
        

          {/* Booking Table */}
<div className="overflow-x-auto mt-12 shadow-lg rounded-lg">
    <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
            {bookingInfoHeader()}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {selectedAgents.map((agentsForDay, dayIndex) => (
                <React.Fragment key={dayIndex}>
                    {/* Date Header */}
                    <tr className="bg-indigo-100">
                        <td colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                            {formatDate(dateRange[dayIndex])}
                        </td>
                    </tr>
                    {/* Agents Rows */}
                    {agentsForDay.map((agentPhone, agentIndex) => (
                        <tr key={`agent-${dayIndex}-${agentIndex}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {agentPhone ? phoneToNameMap[agentPhone] : 'Select Agent'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {renderAgentDropdown(dayIndex, agentIndex, agentPhone)}
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
        </tbody>
    </table>
</div>


            {/* Save Button */}
            <div className="flex justify-center mt-4">
                <button 
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" 
                    onClick={handleSaveSelection}
                >
                    Save Selection
                </button>
            </div>
        </div>
    </div>
    );
    
   
};

export default BookingModal;
