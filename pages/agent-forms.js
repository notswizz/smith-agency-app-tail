import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AgentFormAgent from '../components/form/AgentFormAgent';
import AvailabilityForm from '../components/form/AvailabilityForm';

const AgentForm = () => {
    const [agents, setAgents] = useState([]);
    const [shows, setShows] = useState([]);

    useEffect(() => {
        fetchAgents();
        fetchShows();
    }, []);

    const fetchAgents = async () => {
        try {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
                console.log('Fetched Agents:', data); // Debugging line
            } else {
                console.error('Failed to fetch agents');
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const fetchShows = async () => {
        try {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const data = await response.json();
                setShows(data);
                console.log('Fetched Shows:', data); // Debugging line
            } else {
                console.error('Failed to fetch shows');
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
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
            fetchAgents(); // Assuming you want to refresh the agents list after adding a new agent
        } else {
            console.error('Failed to add agent', await response.json());
        }
    };

    const handleAvailabilityAdded = async (availabilityData) => {
        const response = await fetch('/api/availability/addAvailability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(availabilityData),
        });

        if (!response.ok) {
            console.error('Failed to add availability', await response.json());
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AgentFormAgent onAgentAdded={handleAgentAdded} />
                    </div>
                    <div className="flex-1 max-h-400 overflow-auto">
                        <AvailabilityForm agents={agents} shows={shows} onAvailabilityAdded={handleAvailabilityAdded} />
                    </div>
                </div>
                
            </div>
        </>
    );
};

export default AgentForm;
