import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS
import { loadData, saveData } from '../lib/storage';


// Function to create a date without the timezone offset
function createDateWithoutTimezoneOffset(dateString) {
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
}

// This function generates a range of dates between two dates
const generateDateRange = (start, end) => {
  let dates = [];
  let currentDate = new Date(start.toISOString().split('T')[0]); // Remove the time part
  let endDate = new Date(end.toISOString().split('T')[0]);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const Modal = ({ booking, onClose, onUpdateBooking }) => {
    if (!booking) return null;

    // Create start and end dates without timezone offset
    const startDate = createDateWithoutTimezoneOffset(booking.startDate);
    const endDate = createDateWithoutTimezoneOffset(booking.endDate);

    // Initialize selectedAgents as an array
    const [selectedAgents, setSelectedAgents] = useState(booking.agentSelection || []);

    // Load agents
    const [agents, setAgents] = useState(loadData('agents') || []);

    useEffect(() => {
        // Populate the selectedAgents state based on booking.agentCounts
        const dateRange = generateDateRange(startDate, endDate);
        const initialSelectedAgents = dateRange.map((date, index) => {
            return new Array(booking.agentCounts[index] || 0).fill('');
        });
        setSelectedAgents(initialSelectedAgents);
    }, [booking, startDate, endDate]);

    const handleAgentSelection = (dayIndex, agentIndex, selectedAgentId) => {
      const updatedSelection = [...selectedAgents];
      updatedSelection[dayIndex][agentIndex] = selectedAgentId;
      setSelectedAgents(updatedSelection);
    };

    const handleSubmit = () => {
      // Update the booking with the selected agents
      const updatedBooking = { ...booking, agentSelection: selectedAgents };
      const updatedBookings = loadData('bookings').map(b => b.id === booking.id ? updatedBooking : b);
      saveData('bookings', updatedBookings);
      onUpdateBooking(updatedBooking); // Call the provided onUpdateBooking function with the updated booking
      onClose(); // Close the modal after updating
    };

    const renderAgentDropdown = (dayIndex, agentIndex) => {
        const selectedAgentId = selectedAgents[dayIndex][agentIndex];
        const selectedAgent = agents.find(agent => agent.id === selectedAgentId);

        return (
            <select
                value={selectedAgentId}
                onChange={(e) => handleAgentSelection(dayIndex, agentIndex, e.target.value)}
            >
                {selectedAgentId ? 
                    <option value={selectedAgentId}>{selectedAgent?.name || 'Unknown Agent'}</option> : 
                    <option value="">Select Agent</option>
                }
                {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                        {agent.name}
                    </option>
                ))}
            </select>
        );
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
                    rangeColors={["#3d91ff"]} // Your highlight color
                    showSelectionPreview={true}
                />
                <div className="table-container">
                    <table>
                        <tbody>
                            {selectedAgents.map((agentsForDay, dayIndex) => (
                                <tr key={dayIndex}>
                                    {agentsForDay.map((_, agentIndex) => (
                                        <td key={agentIndex}>
                                            {renderAgentDropdown(dayIndex, agentIndex)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="button" onClick={handleSubmit}>Save Selection</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
