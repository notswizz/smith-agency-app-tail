import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styling, you can customize it as needed



const AvailabilityCalendar = ({ availabilityData }) => {
    // Function to check if a date is in the availability data
    const isAvailable = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return availabilityData.some(avail => avail.availability.includes(dateString));
    };

    // Custom tile content to show which agents are available on a particular date
    const tileContent = ({ date, view }) => {
        if (view === 'month' && isAvailable(date)) {
            const availableAgents = availabilityData.filter(avail => avail.availability.includes(date.toISOString().split('T')[0]));
            return (
                <div>
                    {availableAgents.map(agent => (
                        <p key={agent.agent}>{agent.agent}</p>
                    ))}
                </div>
            );
        }
    };

    return (
        <div>
            <Calendar
                tileContent={tileContent}
                className="customCalendar" // Apply your custom class
            />
        </div>
    );
};

export default AvailabilityCalendar;
