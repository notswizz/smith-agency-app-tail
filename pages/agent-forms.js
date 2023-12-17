import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
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
            } else {
                console.error('Failed to fetch shows');
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
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
            <div className="container mx-auto px-4 py-4">
                <AvailabilityForm 
                    agents={agents} 
                    shows={shows} 
                    onAvailabilityAdded={handleAvailabilityAdded} 
                />
            </div>
        </>
    );
};

export default AgentForm;
