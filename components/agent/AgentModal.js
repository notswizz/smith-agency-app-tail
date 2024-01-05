import React, { useState, useEffect } from 'react';

const AgentModal = ({ agent, isOpen, onClose, onDeleteAgent }) => {
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center" id="my-modal">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
                {/* Close button */}
                <div className="flex justify-end p-2">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        Close
                    </button>
                </div>
    
                {/* Agent Details */}
                <div className="px-6 py-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{agent.name}</h2>
                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {agent.email}</p>
                    <p className="text-gray-700"><span className="font-semibold">Phone:</span> {agent.phone}</p>
                    <p className="text-gray-700"><span className="font-semibold">Instagram:</span> {agent.instagram}</p>
                    <p className="text-gray-700"><span className="font-semibold">Location:</span> {agent.location}</p>
                    <p className="text-gray-700"><span className="font-semibold">Clothing Size:</span> {agent.clothingSize}</p>
                    <p className="text-gray-700"><span className="font-semibold">Shoe Size:</span> {agent.shoeSize}</p>
                    <p className="text-gray-700"><span className="font-semibold">College:</span> {agent.college}</p>
                    <p className="text-gray-700"><span className="font-semibold">Sales Experience:</span> {agent.salesExperience}</p>
                    {/* Resume Link */}
                    {agent.resumeUrl && (
                        <p className="mt-3">
                            <a href={agent.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
                                View Resume
                            </a>
                        </p>
                    )}
                </div>
    
                <div className="px-6 py-4 bg-gray-50">
                    <h3 className="text-md font-semibold text-gray-900">Clients Worked For:</h3>
                    <ul className="list-disc list-inside">
                        {Object.entries(clientWorkSummary).map(([client, days]) => (
                            <li key={client} className="text-gray-700">{client} - {days} days</li>
                        ))}
                    </ul>
                </div>
    
                {/* Delete Button in the Top Right Corner */}
                <div className="absolute top-0 right-0 p-4">
                    <button 
                        onClick={() => onDeleteAgent(agent._id)} 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 text-xs rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
                        Delete
                    </button>
                </div>

                   {/* Close Button at the Bottom */}
            <div className="flex justify-center py-4 bg-gray-50">
                <button 
                    onClick={onClose} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                >
                    Close
                </button>
            </div>
            
            </div>
        </div>
    );
    
};

export default AgentModal;