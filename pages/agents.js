import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AgentForm from '../components/agent/AgentForm';
import AgentData from '../components/agent/AgentData';


const AgentsPage = () => {
    const [agents, setAgents] = useState([]);

    // Move fetchAgents outside of useEffect
    const fetchAgents = async () => {
        const response = await fetch('/api/agents/getAgents'); // Adjust this to your GET API
        if (response.ok) {
            const data = await response.json();
            setAgents(data);
        }
    };

    useEffect(() => {
        fetchAgents();
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
            fetchAgents(); // Now fetchAgents is accessible here
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

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 glow-box">
                <div className="flex flex-row justify-between space-x-4">
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentForm onAgentAdded={handleAgentAdded} />
                    </div>
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentData agents={agents} onDeleteAgent={handleDeleteAgent} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentsPage;