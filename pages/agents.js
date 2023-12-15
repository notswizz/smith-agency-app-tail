import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AgentForm from '../components/agent/AgentForm';
import AgentData from '../components/agent/AgentData';

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [agentAppearances, setAgentAppearances] = useState({});

    const fetchAgentsAndBookings = async () => {
        const agentsResponse = await fetch('/api/agents/getAgents');
        const agentsData = agentsResponse.ok ? await agentsResponse.json() : [];
        setAgents(agentsData);

        const bookingsResponse = await fetch('/api/bookings/getBookings');
        const bookingsData = bookingsResponse.ok ? await bookingsResponse.json() : [];
        setBookings(bookingsData);

        const agentNameToIdMap = agentsData.reduce((acc, agent) => {
            acc[agent.name] = agent._id;
            return acc;
        }, {});

        const counts = countAgentAppearances(bookingsData, agentNameToIdMap);
        setAgentAppearances(counts);
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

    const countAgentAppearances = (bookings, agentNameToIdMap) => {
        const counts = {};
        bookings.forEach(booking => {
            booking.agentSelection.forEach(dayAgents => {
                dayAgents.forEach(agentName => {
                    const agentId = agentNameToIdMap[agentName];
                    counts[agentId] = (counts[agentId] || 0) + 1;
                });
            });
        });
        return counts;
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                {/* Update the className to use flex-col for mobile and flex-row for larger screens */}
                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                   
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentData agents={agents} onDeleteAgent={handleDeleteAgent} agentAppearances={agentAppearances} />
                    </div>
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentForm onAgentAdded={handleAgentAdded} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentsPage;