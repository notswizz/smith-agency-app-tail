import React, { useState, useEffect, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils'; // Corrected import statement
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

    // Fetch agents data on component mount
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

    const startDate = useMemo(() => new Date(toUTCDateString(booking.startDate)), [booking.startDate]);
    const endDate = useMemo(() => new Date(toUTCDateString(booking.endDate)), [booking.endDate]);
    const dateRange = useMemo(() => generateDateRange(startDate, endDate), [startDate, endDate]);

    const [selectedAgents, setSelectedAgents] = useState(booking.agentSelection || []);
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        // Initialize selected agents state based on booking data
        const initialSelectedAgents = dateRange.map((_, index) => {
            return booking.agentSelection[index] || new Array(booking.agentCounts[index] || 0).fill('');
        });
        setSelectedAgents(initialSelectedAgents);
    }, [dateRange, booking.agentSelection, booking.agentCounts]);

    const bookingInfoHeader = () => (
        <tr className="bg-gray-50">
            <th colSpan="100%" className="py-2 px-4 text-left text-gray-700">
                -- {booking.show} ---- {booking.client} ---- {startDate.toISOString().split('T')[0]} -- {endDate.toISOString().split('T')[0]} --
            </th>
        </tr>
    );

    const handleAgentSelection = (dayIndex, agentIndex, selectedAgentId) => {
        const updatedSelection = [...selectedAgents];
        updatedSelection[dayIndex][agentIndex] = selectedAgentId;
        setSelectedAgents(updatedSelection);
    };

    const handleSubmit = async () => {
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
            onUpdateBooking(updatedBooking);
            onClose();
        } else {
            console.error('Failed to update booking');
        }
    };

    const renderAgentDropdown = (dayIndex, agentIndex, selectedAgentId) => {
        return (
            <select
                value={selectedAgentId || ''}
                onChange={(e) => handleAgentSelection(dayIndex, agentIndex, e.target.value)}
            >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
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
                    {i === 0 && (
                        <td rowSpan={Math.ceil(agentsForDay.length / MAX_AGENTS_PER_ROW)}>
                            <div className="date-label">{date.toISOString().split('T')[0]}</div>
                        </td>
                    )}
                    {agentsInRow.map((agentId, agentIndex) => (
                        <td key={`agent-${agentIndex}`} className={agentId ? 'bg-green-100' : 'bg-red-100'}>
                            {renderAgentDropdown(dayIndex, i + agentIndex, agentId)}
                        </td>
                    ))}
                </tr>
            );
        }
        return rows;
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
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" onClick={handleSubmit}>Save Selection</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
