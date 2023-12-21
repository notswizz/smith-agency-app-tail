import React, { useState, useEffect } from 'react';

const AgentModal = ({ agent, isOpen, onClose }) => {
    const [clientWorkSummary, setClientWorkSummary] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings/getBookings');
                if (!response.ok) throw new Error('Error in fetching bookings');
                const data = await response.json();
                processAgentBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        if (isOpen) {
            fetchBookings();
        }
    }, [isOpen, agent.name]);

    const processAgentBookings = (bookings) => {
        const summary = {};

        bookings.forEach(booking => {
            const daysWorked = booking.agentSelection.reduce(
                (count, selection) => count + (selection.includes(agent.name) ? 1 : 0), 0
            );

            if (daysWorked > 0) {
                if (!summary[booking.client]) {
                    summary[booking.client] = 0;
                }
                summary[booking.client] += daysWorked;
            }
        });

        setClientWorkSummary(summary);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            {/* Modal content */}
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                {/* Close button */}
                <div className="flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        Close
                    </button>
                </div>

                {/* Agent Details */}
                <div className="py-2">
                    <h2 className="text-lg font-semibold text-gray-900">{agent.name}</h2>
                    <p className="text-gray-600">Email: {agent.email}</p>
                    <p className="text-gray-600">Phone: {agent.phone}</p>
                    <p className="text-gray-600">Instagram: {agent.instagram}</p>
                    <p className="text-gray-600">Location: {agent.location}</p>
                    <p className="text-gray-600">Shoe Size: {agent.shoeSize}</p>
                    <p className="text-gray-600">College: {agent.college}</p>
                </div>

                <div>
                    <h3 className="text-md font-semibold text-gray-900">Clients Worked For:</h3>
                    <ul className="list-disc list-inside">
                        {Object.entries(clientWorkSummary).map(([client, days]) => (
                            <li key={client} className="text-gray-600">{client} - {days} days</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AgentModal;