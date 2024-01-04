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
    const [agentsByDate, setAgentsByDate] = useState({});
    const [allAgents, setAllAgents] = useState([]);
    const [deselectedAgents, setDeselectedAgents] = useState({});

  

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

    // Fetch all agents once and store them
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

    // Create a mapping of phone numbers to agent names
    const phoneToNameMap = useMemo(() => {
        const map = {};
        allAgents.forEach(agent => {
            map[agent.phone] = agent.name;
        });
        return map;
    }, [allAgents]);

    // Updated handleAgentSelection to accurately track deselections
    const handleAgentSelection = (dayIndex, agentIndex, agentPhone) => {
        const previousAgentPhone = selectedAgents[dayIndex][agentIndex];
        const updatedAgents = [...selectedAgents];
        updatedAgents[dayIndex][agentIndex] = agentPhone;
        setSelectedAgents(updatedAgents);
    
        // Update deselectedAgents state when an agent is deselected
        if (previousAgentPhone && previousAgentPhone !== agentPhone) {
            const date = toUTCDateString(dateRange[dayIndex]);
            setDeselectedAgents(prev => ({...prev, [`${date}-${previousAgentPhone}`]: true}));
        }
    };

   
    const handleSaveSelection = async () => {
        // Preparing update requests for new selections
        const updateRequests = selectedAgents.flatMap((agentsForDay, dayIndex) => {
            const date = toUTCDateString(dateRange[dayIndex]);
            return agentsForDay
                .filter(agentPhone => agentPhone) // Filter out empty selections
                .map(agentPhone => ({
                    agentPhone, 
                    dateToBook: date, 
                    status: 'booked'
                }));
        });
    
        // Preparing deselection requests
        const deselectionRequests = Object.keys(deselectedAgents).map(key => {
            const [date, agentPhone] = key.split("-");
            return {
                agentPhone, 
                dateToBook: date, 
                status: 'open'
            };
        });
    
        // Combine and send all requests
        try {
            const allRequests = [...updateRequests, ...deselectionRequests];
            
            // Debugging: Log the requests to be sent
            console.log('All requests:', JSON.stringify(allRequests, null, 2));
    
            const isValidPhone = phone => /^\d{10}$/.test(phone);
            const isValidDate = date => !isNaN(new Date(date).getTime());
            
            await Promise.all(allRequests.map(req => {
                // Validate each request
                if (!isValidPhone(req.agentPhone) || !isValidDate(req.dateToBook) || !req.status) {
                    console.error('Invalid request data:', req);
                    return Promise.resolve(); // Skip invalid requests
                }
    
                // Sending the API request
                return fetch('/api/availability/modifyAvailability', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                }).then(response => {
                    if (!response.ok) {
                        console.error(`Failed request: ${JSON.stringify(req)}`); // Log the failed request
                        console.error(`HTTP error! Status: ${response.status}`);
                        return; // Prevent further execution in this fetch chain
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
            // Handle error
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
                {selectedAgentPhone ? (
                    <option value={selectedAgentPhone} key={selectedAgentPhone}>
                        {phoneToNameMap[selectedAgentPhone]}
                    </option>
                ) : (
                    <option value="" key="default">Select Agent</option>
                )}
                {agentsForThisDate.map((agent) => (
                    <option key={agent._id.$oid} value={agent.phone}>
                        {phoneToNameMap[agent.phone] || agent.name}
                    </option>
                ))}
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
                        -- {booking.show} ---- {booking.client} ---- {startDate.toISOString().split('T')[0]} -- {endDate.toISOString().split('T')[0]} --
                    </th>
                </tr>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4">
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
