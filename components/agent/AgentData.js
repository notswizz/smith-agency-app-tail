import React from 'react';

const AgentData = ({ agents, onDeleteAgent, agentAppearances }) => {
    const formatLocation = (location) => {
        return Array.isArray(location) ? location.join(', ') : location;
    };

    const sortedAgents = agents.sort((a, b) => {
        return (agentAppearances[b._id] || 0) - (agentAppearances[a._id] || 0);
    });

    return (
        <div className="flex flex-col space-y-4 max-h-96 overflow-auto">
            {sortedAgents.map(agent => (
                <div className="bg-white p-4 rounded shadow-md flex justify-between" key={agent._id}>
                    <div> {/* Left column for agent details */}
                        <h3 className="text-lg font-bold">
                            <a href={`https://www.instagram.com/${agent.instagram}/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{agent.name}</a>
                        </h3>
                        <p className="text-gray-600">{agent.email}</p>
                        <p className="text-gray-600">{agent.phone}</p>
                        <p className="text-gray-600">{formatLocation(agent.location)}</p>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                            {agentAppearances[agent._id] || 0} Days
                        </span>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Email</button>
            
                        <button onClick={() => onDeleteAgent(agent._id)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
                    </div>
                    <div> {/* Right column for notes */}
                        {agent.notes && (
                            <p className="text-gray-600">{agent.notes}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgentData;
