import React, { useState, useEffect } from 'react';

const AgentData = ({ agents, onDeleteAgent }) => {
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
                <div className="bg-white p-4 rounded shadow-md flex" key={agent._id}>
                    {/* Agent Info and Image Container */}
                    <div className="flex-1 flex">
                        {/* Image */}
                        {agent.imageUrl && (
                            <img src={agent.imageUrl} alt={agent.name} className="w-40 h-40 object-cover rounded-full mr-4" />
                        )}
    
                        {/* Agent Details */}
                        <div>
                            <h3 className="text-lg font-bold">
                                <a href={`https://www.instagram.com/${agent.instagram}/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{agent.name}</a>
                            </h3>
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                {agentDaysWorked[agent.name] || 0} Days Worked
                            </span>
                            <p className="text-gray-600">{agent.email}</p>
                            <p className="text-gray-600">{agent.phone}</p>
                            <p className="text-gray-600">Location: {agent.location.join(', ')}</p>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Email</button>
                            <button onClick={() => onDeleteAgent(agent._id)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
                        </div>
                    </div>
    
                    <div className="clients-list ml-4 hidden md:block">
    <h4 className="font-bold">Bookings:</h4>
    <ul>
        {agentClients[agent.name] && agentClients[agent.name].map(client => (
            <li key={client}>{client}</li>
        ))}
    </ul>
</div>

                </div>
            ))}
        </div>
    );
    
};

export default AgentData;
