import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AgentForm from '../components/agent/AgentForm';
import AgentData from '../components/agent/AgentData';
import AgentFilter from '../components/agent/AgentFilter'; // Import the AgentFilter component

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]); // State for filtered agents
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        const response = await fetch('/api/agents/getAgents');
        if (response.ok) {
            const data = await response.json();
            setAgents(data);
            setFilteredAgents(data); // Initially, all agents are shown
        }
    };

    const handleAgentAdded = async (newAgent) => {
        const response = await fetch('/api/agents/addAgent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAgent),
        });

        if (response.ok) {
            fetchAgents(); // Refresh the agents list
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

    const handleFilterChange = (filters) => {
        const { name, location } = filters;
        const filtered = agents.filter(agent => {
            const agentName = typeof agent.name === 'string' ? agent.name : "";
            return (
                (name ? agentName.toLowerCase().includes(name.toLowerCase()) : true) &&
                (location ? agent.location.includes(location) : true)
            );
        });
        setFilteredAgents(filtered); // Update the state with filtered agents
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-4 md:mr-4">
                        <button 
                            onClick={toggleFormVisibility}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
                        >
                            {isFormVisible ? 'Hide Form' : 'Add New Agent'}
                        </button>
                        {!isFormVisible && <AgentFilter onFilterChange={handleFilterChange} />}
                    </div>
                    <div className="flex-1">
                        {isFormVisible ? (
                            <AgentForm onAgentAdded={handleAgentAdded} />
                        ) : (
                            <AgentData agents={filteredAgents} onDeleteAgent={handleDeleteAgent} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentsPage;