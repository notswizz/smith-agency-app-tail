import React, { useState, useEffect } from 'react';

const AgentModal = ({ agent, isOpen, onClose }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/getbookings');
                if (!response.ok) throw new Error('Error in fetching bookings');
                const data = await response.json();
                setBookings(data.filter(booking => booking.agentId === agent._id));
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        if (isOpen) {
            fetchBookings();
        }
    }, [isOpen, agent._id]);

    if (!isOpen) return null;

    return (
        <div className="agent-modal">
            <button onClick={onClose}>Close</button>
            <h2>{agent.name}</h2>
            <p>Email: {agent.email}</p>
            <p>Phone: {agent.phone}</p>
            <p>Instagram: {agent.instagram}</p>
            <p>Location: {agent.location}</p>
            <p>Days Worked: {agentDaysWorked[agent.name] || 0}</p>
            <div>
                <h3>Clients Worked For:</h3>
                <ul>
                    {bookings.map(booking => (
                        <li key={booking._id}>{booking.clientName}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AgentModal;
