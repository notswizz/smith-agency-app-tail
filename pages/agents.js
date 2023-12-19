import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AgentForm from '../components/agent/AgentForm';
import AgentData from '../components/agent/AgentData';
import AgentFilter from '../components/agent/AgentFilter';
import AgentModal from '../components/agent/AgentModal'; // Import AgentModal

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [filteredAgentCount, setFilteredAgentCount] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [selectedAgent, setSelectedAgent] = useState(null); // State for selected agent

    useEffect(() => {
        const fetchAgents = async () => {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
                setFilteredAgents(data);
                setFilteredAgentCount(data.length);
            }
        };
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
        if (filters.name === '' && filters.location === '') {
            // If filters are reset to default, show all agents
            setFilteredAgents(agents);
            setFilteredAgentCount(agents.length);
        } else {
            // Apply filters
            const { name, location } = filters;
            const filtered = agents.filter(agent => {
                const agentName = typeof agent.name === 'string' ? agent.name.toLowerCase() : "";
                return (
                    (name ? agentName.includes(name.toLowerCase()) : true) &&
                    (location ? agent.location.includes(location) : true)
                );
            });
            setFilteredAgents(filtered);
            setFilteredAgentCount(filtered.length);
        }
    };

   // Function to handle agent selection for modal
   const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setIsModalVisible(true);
};

// Function to close the modal
const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedAgent(null);
};

return (
        <>
            <Header />
            <div className="container mx-auto px-4 ">
                <div className="flex flex-col md:flex-row ">
                    <div className="md:w-1/4 mb-4 md:mb-4 md:mr-4 ">
                        <button 
                            onClick={toggleFormVisibility}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
                        >
                            {isFormVisible ? 'Hide Form' : 'Add New Agent'}
                        </button>
                        {!isFormVisible &&  <AgentFilter 
                        onFilterChange={handleFilterChange}
                        filteredAgentCount={filteredAgentCount} // Pass the count to the filter component
                    />}
                    </div>
                    <div className="flex-1">
                        {isFormVisible ? (
                            <AgentForm onAgentAdded={handleAgentAdded} />
                        ) : (
                            <AgentData agents={filteredAgents} onDeleteAgent={handleDeleteAgent} onAgentSelect={handleAgentSelect} />
                        )}
                    </div>
                </div>
            </div>
            {/* AgentModal */}
            {selectedAgent && (
                <AgentModal agent={selectedAgent} isOpen={isModalVisible} onClose={handleCloseModal} />
            )}
        </>
    );
};

export default AgentsPage;