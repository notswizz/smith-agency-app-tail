import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AgentForm from '../components/agent/AgentForm';
import AgentData from '../components/agent/AgentData';

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false); // State for form visibility

    const fetchAgentsAndBookings = async () => {
        const agentsResponse = await fetch('/api/agents/getAgents');
        const agentsData = agentsResponse.ok ? await agentsResponse.json() : [];
        setAgents(agentsData);
    };

    useEffect(() => {
        fetchAgentsAndBookings();
    }, []);

    const handleAgentAdded = async (newAgent) => {
        const response = await fetch('/api/agents/addAgent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAgent),
        });

        if (response.ok) {
            fetchAgentsAndBookings();
        } else {
            console.error('Failed to add agent', await response.json());
        }
    };

    const handleDeleteAgent = async (agentId) => {
        const response = await fetch(`/api/agents/deleteAgent?id=${agentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setAgents(agents.filter(agent => agent._id !== agentId));
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <button 
                    onClick={toggleFormVisibility}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    {isFormVisible ? 'Hide Form' : 'Add New Agent'}
                </button>

                {isFormVisible ? (
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentForm onAgentAdded={handleAgentAdded} />
                    </div>
                ) : (
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentData agents={agents} onDeleteAgent={handleDeleteAgent} />
                    </div>
                )}
            </div>
        </>
    );
};

export default AgentsPage;
