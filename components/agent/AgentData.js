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

    const processBookings = (bookings) => {
        const agentToClientsMap = {};
        const daysWorkedMap = {};

        bookings.forEach(booking => {
            booking.agentSelection.flat().forEach(agentName => {
                if (agentName) {
                    if (!agentToClientsMap[agentName]) {
                        agentToClientsMap[agentName] = new Set();
                        daysWorkedMap[agentName] = 0;
                    }
                    agentToClientsMap[agentName].add(booking.client);
                    daysWorkedMap[agentName] += 1;
                }
            });
        });

        setAgentClients(convertSetsToArrays(agentToClientsMap));
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
                    className="bg-white p-4 rounded shadow-md flex relative cursor-pointer"
                    key={agent._id}
                    onClick={() => onAgentSelect(agent)} // Add onClick event
                >
                   
                    {/* Agent Info and Image Container */}
                    <div className="flex-1 flex">
                        {/* Image */}
                        {agent.imageUrl && (
                            <img src={agent.imageUrl} alt={agent.name} className="w-40 h-40 object-cover rounded-full mr-4 shadow-sm" />
                        )}
    
                        {/* Agent Details */}
                        <div>
                            <h3 className="text-lg font-bold">
                                <a href={`https://www.instagram.com/${agent.instagram}/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{agent.name}</a>
                            </h3>
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                {agentDaysWorked[agent.name] || 0} Days Booked
                            </span>
                            <p className="text-gray-600">{agent.email}</p>
                            <p className="text-gray-600">{agent.phone}</p>
                            <p className="text-gray-600">Location: {agent.location.join(', ')}</p>
                            <br></br>
                             {/* Icons for Email and Text */}
                    <div className="flex items-center">
                        <MailOutline
                            color={'#00000'} 
                            height="35px"
                            width= "35px"
                            style={{ marginRight: '10px' }}
                            onClick={() => {/* Handle Email Action */}}
                        />
                        <ChatbubblesOutline
                            color={'#00000'} 
                            height="35px"
                            width="35px"
                            onClick={() => {/* Handle Text Action */}}
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
