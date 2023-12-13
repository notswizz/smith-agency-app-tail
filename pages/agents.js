import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AgentForm from '../components/AgentForm';
import AgentData from '../components/AgentData';
import Footer from '../components/Footer';

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);

    // Fetch agents from the MongoDB database
    useEffect(() => {
        const fetchAgents = async () => {
            const response = await fetch('/api/getAgents');
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
            } else {
                console.error('Failed to fetch agents');
            }
        };

        fetchAgents();
    }, []);

    // Handle adding a new agent
    const handleAgentAdded = async (agent) => {
        const response = await fetch('/api/addAgent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agent),
        });

        if (response.ok) {
            const newAgent = await response.json();
            setAgents(prevAgents => [...prevAgents, newAgent]);
        } else {
            console.error('Failed to add agent');
        }
    };

    // Handle deleting an agent
    const handleDeleteAgent = async (agentId) => {
        const response = await fetch(`/api/deleteAgent/${agentId}`, { method: 'DELETE' });
        if (response.ok) {
            setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
        } else {
            console.error('Failed to delete agent');
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <AgentForm onAgentAdded={handleAgentAdded} />
                <AgentData agents={agents} onDeleteAgent={handleDeleteAgent} />
            </div>
            <Footer />
        </>
    );
};

export default AgentsPage;
