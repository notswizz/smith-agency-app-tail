import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
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



   // Toggle between forms
   const toggleForm = () => {
    setIsAgentFormActive(!isAgentFormActive);
};

return (
    <>
        <Header />
        <div className="container mx-auto px-4 py-4">
            <img src="/tsalogo.png" alt="TSA Logo" className="mx-auto mb-4 max-w-full h-auto" />
            <button onClick={toggleForm} className="mb-4 bg-hot-pink-500 hover:bg-hot-pink-700 text-white font-bold py-2 px-4 rounded block w-full sm:w-auto">
                {isAgentFormActive ? 'Switch to Availability Form' : 'Switch to New Agent Form'}
            </button>

            {isAgentFormActive ? (
                <div>
                    <h2 className="text-center text-hot-pink-500 text-xl font-bold mb-4">New Agent Form</h2>
                    <p className="text-white mb-4">Use this form to add new agents. Fill in the details like name, email, phone, and more.</p>
                    <AgentFormAgent />
                </div>
            ) : (
                <div>
                    <h2 className="text-center text-hot-pink-500 text-xl font-bold mb-4">Availability Form</h2>
                    <p className="text-white mb-4">This form is used to update the availability of agents for various shows. Select an agent, a show, and set the available dates.</p>
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