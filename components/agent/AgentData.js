import React from 'react';

const AgentData = ({ agents, onDeleteAgent }) => {
    const formatLocation = (location) => {
        return Array.isArray(location) ? location.join(', ') : location;
    };

    return (
        <div className="flex flex-col space-y-4 max-h-96 overflow-auto"> {/* Set a fixed max-height and make it scrollable */}
            {agents.map(agent => (
                <div className="bg-white p-4 rounded shadow-md" key={agent._id}> {/* Ensure correct key */}
                    <h3 className="text-lg font-bold">
                        <a href={`https://www.instagram.com/${agent.instagram}/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{agent.name}</a>
                    </h3>
                    <p className="text-gray-600">{agent.email}</p>
                    <p className="text-gray-600">{agent.phone}</p>
                    <p className="text-gray-600">{formatLocation(agent.location)}</p>
                    <button onClick={() => onDeleteAgent(agent._id)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button> {/* Use _id for MongoDB documents */}
                </div>
            ))}
        </div>
    );
};

export default AgentData;