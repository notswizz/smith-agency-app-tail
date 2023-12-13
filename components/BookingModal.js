import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { loadData, saveData } from '../lib/storage';

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

    const startDate = createDateWithoutTimezoneOffset(booking.startDate);
    const endDate = createDateWithoutTimezoneOffset(booking.endDate);

    const [selectedAgents, setSelectedAgents] = useState(booking.agentSelection || []);
    const [agents, setAgents] = useState(loadData('agents') || []);
    const dateRange = generateDateRange(startDate, endDate);

    useEffect(() => {
        const initialSelectedAgents = dateRange.map((date, index) => {
            return booking.agentSelection[index] || new Array(booking.agentCounts[index] || 0).fill('');
        });
        setSelectedAgents(initialSelectedAgents);
    }, [booking, startDate, endDate]);

    const handleAgentSelection = (dayIndex, agentIndex, selectedAgentId) => {
        const updatedSelection = [...selectedAgents];
        updatedSelection[dayIndex][agentIndex] = selectedAgentId;
        setSelectedAgents(updatedSelection);
    };

    const handleSubmit = () => {
        const updatedBooking = { ...booking, agentSelection: selectedAgents };
        const updatedBookings = loadData('bookings').map(b => b.id === booking.id ? updatedBooking : b);
        saveData('bookings', updatedBookings);

        console.log("Saved agentSelection Array: ", selectedAgents);

        onUpdateBooking(updatedBooking);
        onClose();
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
