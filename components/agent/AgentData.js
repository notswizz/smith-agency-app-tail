import React, { useState, useEffect } from 'react';
import { MailOutline, ChatbubblesOutline } from 'react-ionicons';

const AgentData = ({ agents, onDeleteAgent, onAgentSelect }) => {
    const [agentClients, setAgentClients] = useState({});
    const [agentDaysWorked, setAgentDaysWorked] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('/api/bookings/getBookings');
            if (response.ok) {
                const bookings = await response.json();
                processBookings(bookings);
            }
        };

        fetchBookings();
    }, []);

     // Function to handle SMS action
     const handleTextMessage = (phoneNumber) => {
        window.location.href = `sms:${phoneNumber}`;
    };

    const processBookings = (bookings) => {
        const daysWorkedMap = {};
    
        bookings.forEach(booking => {
            // Loop over each day's selection of agents.
            booking.agentSelection.forEach(daySelection => {
                daySelection.forEach(agentPhone => {
                    if (agentPhone) {
                        // If the agent doesn't have an entry yet, initialize it.
                        if (!daysWorkedMap[agentPhone]) {
                            daysWorkedMap[agentPhone] = 0;
                        }
                        // Increment the number of days worked for the agent by 1.
                        // But only if the agent wasn't already counted for this day.
                        if (!daySelection.includes(daysWorkedMap[agentPhone])) {
                            daysWorkedMap[agentPhone] += 1;
                        }
                    }
                });
            });
        });
    
        setAgentDaysWorked(daysWorkedMap);
    };
    

    const convertSetsToArrays = (setsMap) => {
        const arraysMap = {};
        Object.keys(setsMap).forEach(key => {
            arraysMap[key] = Array.from(setsMap[key]);
        });
        return arraysMap;
    };

    return (
        <div className="flex flex-col space-y-4 max-h-96 overflow-auto">
            {agents.map(agent => (
                <div 
                    className="bg-white p-4 rounded shadow-md flex relative"
                    key={agent._id}
                >
                    {/* Agent Info and Image Container */}
                    <div className="flex-1 flex">
                        {/* Google Image */}
                        {agent.googleImageUrl && (
                            <img 
                                src={agent.googleImageUrl} 
                                alt={agent.name} 
                                className="w-40 h-40 object-cover rounded-full mr-4 shadow-sm cursor-pointer"
                                onClick={() => onAgentSelect(agent)}
                            />
                        )}
    
                        {/* Agent Details */}
                        <div>
                            <h3 className="text-lg font-bold">
                                <a href={`https://www.instagram.com/${agent.instagram}/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{agent.name}</a>
                            </h3>
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                {agentDaysWorked[agent.phone] || 0} Days Booked
                            </span>
                           
                            <br></br>
                            <br></br>
                            {/* Icons for Email and Text */}
                            <div className="flex items-center">
                                <MailOutline
                                    color={'#00000'} 
                                    height="35px"
                                    width="35px"
                                    onClick={() => window.location.href = `mailto:${agent.email}`}
                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                />
    
                                <ChatbubblesOutline
                                    color={'#00000'} 
                                    height="35px"
                                    width="35px"
                                    onClick={() => handleTextMessage(agent.phone)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
    
    
};

export default AgentData;
