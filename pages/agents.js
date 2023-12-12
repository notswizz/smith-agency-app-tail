import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AgentForm from '../components/AgentForm';
import AgentData from '../components/AgentData';
import Footer from '../components/Footer'; //
import { loadData, saveData } from '../lib/storage';



const AgentsPage = () => {
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        setAgents(loadData('agents'));
    }, []);

    const handleAgentAdded = (newAgent) => {
        const updatedAgents = [...agents, newAgent];
        saveData('agents', updatedAgents);
        setAgents(updatedAgents);
    };

    const handleDeleteAgent = (agentId) => {
        const updatedAgents = agents.filter(agent => agent.id !== agentId);
        saveData('agents', updatedAgents);
        setAgents(updatedAgents);
    };

    return (
        <>
            <Header />
            <div className="container">
                <AgentForm onAgentAdded={handleAgentAdded} />
                <AgentData agents={agents} onDeleteAgent={handleDeleteAgent} />
            </div>
            <Footer/>
        </>
    );
};

export default AgentsPage;
