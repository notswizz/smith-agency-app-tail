import React, { useState, useEffect } from 'react';
import AvailabilityForm from '../components/form/AvailabilityForm';
import AgentFormAgent from '../components/form/FormAgent'; // Imported AgentFormAgent

const FormsAgent = () => {
    const [agents, setAgents] = useState([]);
    const [shows, setShows] = useState([]);
    const [isAgentFormActive, setIsAgentFormActive] = useState(false); // State to track which form is active

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



    const toggleForm = () => {
        setIsAgentFormActive(!isAgentFormActive);
    };

    return (
        <>
        
            <div className="container mx-auto px-4 py-4 bg-gray-100">
            <img src="/tsawhite.png" alt="TSA Logo" className="mx-auto mb-4" style={{ width: '250px', height: '250px' }} />

                <button 
                    onClick={toggleForm} 
                    className="mb-4 bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded block w-full sm:w-auto transition duration-300 ease-in-out">
                    {isAgentFormActive ? 'Switch to Availability Form' : 'Switch to New Agent Form'}
                </button>

                {isAgentFormActive ? (
                    <div className="p-6 rounded-lg shadow-lg bg-white">
                        <h2 className="text-center text-pink-600 text-xl font-bold mb-4">New Agent Form</h2>
                        <p className="text-gray-600 text-base font-medium mb-4 px-4 py-2">Before completing the Availability Form, all agents, both new and existing, are required to fill out this form to receive their unique Agent ID #. Please note this ID, as it will be required for all future submissions.</p>
                        <AgentFormAgent />
                    </div>
                ) : (
                    <div className="p-6 rounded-lg shadow-lg bg-white">
                        <h2 className="text-center text-pink-800 text-xl font-bold mb-4">Availability Form</h2>
                        <p className="text-gray-600 text-base font-medium mb-4 px-4 py-2">Select a show in your location and input the days you are available to work. A standard day is 9-5.</p>
                        <AvailabilityForm 
                            agents={agents} 
                            shows={shows} 
                            onAvailabilityAdded={handleAvailabilityAdded} 
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default FormsAgent;