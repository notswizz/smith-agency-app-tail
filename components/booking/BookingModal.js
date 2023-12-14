import React, { useState, useEffect, useMemo } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function createDateWithoutTimezoneOffset(dateString) {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
}

const generateDateRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start.toISOString().split('T')[0]);
    let endDate = new Date(end.toISOString().split('T')[0]);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

const Modal = ({ booking, onClose, onUpdateBooking }) => {
    if (!booking) return null;

    useEffect(() => {
        const fetchAgents = async () => {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
            }
        };
        fetchAgents();
    }, [booking]); // Depend only on booking

    const startDate = useMemo(() => createDateWithoutTimezoneOffset(booking.startDate), [booking.startDate]);
    const endDate = useMemo(() => createDateWithoutTimezoneOffset(booking.endDate), [booking.endDate]);
    const dateRange = useMemo(() => generateDateRange(startDate, endDate), [startDate, endDate]);

    const [selectedAgents, setSelectedAgents] = useState(booking.agentSelection || []);
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const initialSelectedAgents = dateRange.map((date, index) => {
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
        const selectedAgent = agents.find(agent => agent.id === selectedAgentId);

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
                            <div className="date-label">{date.toLocaleDateString()}</div>
                        </td>
                    )}
                    {agentsInRow.map((_, agentIndex) => (
                        <td key={`agent-${agentIndex}`}>
                            {renderAgentDropdown(dayIndex, i + agentIndex, agentsForDay[i + agentIndex])}
                        </td>
                    ))}
                </tr>
            );
        }
        return rows;
    };

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                
                <DateRangePicker
                    ranges={[selectionRange]}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#3d91ff"]}
                    showSelectionPreview={true}
                />
                <div className="table-container">
                    <table>
                        <tbody>
                            {selectedAgents.map((agentsForDay, dayIndex) => 
                                renderRowForDate(dateRange[dayIndex], agentsForDay, dayIndex)
                            )}
                        </tbody>
                    </table>
                    <button className="button" onClick={handleSubmit}>Save Selection</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
