import React, { useState, useEffect, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

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

const Modal = ({ booking, onClose, onUpdateBooking }) => {
    if (!booking) return null;

    const [selectedAgents, setSelectedAgents] = useState(booking.agentSelection || []);
    const [agentsByDate, setAgentsByDate] = useState({});
    
    const startDate = useMemo(() => new Date(toUTCDateString(booking.startDate)), [booking.startDate]);
    const endDate = useMemo(() => new Date(toUTCDateString(booking.endDate)), [booking.endDate]);
    const dateRange = useMemo(() => generateDateRange(startDate, endDate), [startDate, endDate]);

    useEffect(() => {
        const fetchAgentsForDate = async (date) => {
            try {
                const response = await fetch(`/api/agents/getAvailAgents?date=${date}`);
                const data = await response.json();
                console.log(`Data for ${date}:`, data); // Debug log
                return response.ok ? data : [];
            } catch (error) {
                console.error(`Error fetching agents for ${date}:`, error);
                return [];
            }
        };

        const fetchAgentsForAllDates = async () => {
            const agentsForDates = {};
            for (const date of dateRange) {
                const formattedDate = toUTCDateString(date);
                agentsForDates[formattedDate] = await fetchAgentsForDate(formattedDate);
            }
            setAgentsByDate(agentsForDates);
        };

        if (booking && booking.startDate && booking.endDate) {
            fetchAgentsForAllDates();
        }
    }, [booking, dateRange]);

    useEffect(() => {
        const initialSelectedAgents = dateRange.map((_, index) => {
            return booking.agentSelection[index] || new Array(booking.agentCounts[index] || 0).fill('');
        });
        setSelectedAgents(initialSelectedAgents);
    }, [dateRange, booking.agentSelection, booking.agentCounts]);

    const handleAgentSelection = (dayIndex, agentIndex, selectedAgentId) => {
        const updatedSelection = [...selectedAgents];
        updatedSelection[dayIndex][agentIndex] = selectedAgentId;
        setSelectedAgents(updatedSelection);
    };

    const handleSubmit = async () => {
        // Update the booking data first
        const updatedBooking = { ...booking, agentSelection: selectedAgents };
        const response = await fetch(`/api/bookings/updateBooking/${booking._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBooking),
        });
    
        if (response.ok) {
            console.log("Agent selection updated: ", selectedAgents);
    
            // Iterate over each day and the agents selected for that day
            for (let dayIndex = 0; dayIndex < selectedAgents.length; dayIndex++) {
                const agentsForDay = selectedAgents[dayIndex];
                const date = toUTCDateString(dateRange[dayIndex]);
    
                for (let agentId of agentsForDay) {
                    if (agentId) {
                        // Send request to update the agent's availability
                        const modifyResponse = await fetch(`/api/availability/modifyAvailability`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ agentId, dateToBook: date }),
                        });
    
                        if (!modifyResponse.ok) {
                            const modifyResult = await modifyResponse.json();
                            console.error(`Failed to modify availability for agent ${agentId} on ${date}:`, modifyResult.message);
                        } else {
                            console.log(`Modified availability for agent ${agentId} on ${date}`);
                        }
                    }
                }
            }
    
            onUpdateBooking(updatedBooking);
            onClose();
        } else {
            console.error('Failed to update booking');
        }
    };
    
    
    

    const renderAgentDropdown = (dayIndex, agentIndex, selectedAgentId, date) => {
        const formattedDate = toUTCDateString(date);
        console.log(`Rendering dropdown for ${formattedDate}`); // Debug log
        const agentsForThisDate = agentsByDate[formattedDate];

        if (!agentsForThisDate) {
            console.log(`No agents for ${formattedDate}`); // Debug log
            return null;
        }
    
        const availableAgents = agentsForThisDate.filter(agent =>
            agent.availability.some(avail =>
                avail.date === formattedDate && avail.status === 'open'
            )
        );

        return (
            <select
                value={selectedAgentId || ''}
                onChange={(e) => handleAgentSelection(dayIndex, agentIndex, e.target.value)}
            >
                <option value="">Select Agent</option>
                {availableAgents.map((agent) => (
                    <option key={agent._id.$oid} value={agent._id.$oid}>
                        {agent.name}
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

    const bookingInfoHeader = () => (
        <tr className="bg-gray-50">
            <th colSpan="100%" className="py-2 px-4 text-left text-gray-700">
                -- {booking.show} ---- {booking.client} ---- {startDate.toISOString().split('T')[0]} -- {endDate.toISOString().split('T')[0]} --
            </th>
        </tr>
    );

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
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" onClick={handleSubmit}>Save Selection</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
