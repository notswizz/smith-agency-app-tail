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

  



    const toggleForm = () => {
        setIsAgentFormActive(!isAgentFormActive);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-4 bg-gray-100">
                <img src="/tsawhite.png" alt="TSA Logo" className="mx-auto mb-4" style={{ width: '100px', height: '100px' }} />
    
                <div className="flex justify-center gap-4 mb-4">
                    <button 
                        onClick={toggleForm} 
                        className={`font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${isAgentFormActive ? 'bg-gray-300 text-gray-700' : 'bg-pink-500 hover:bg-pink-700 text-white'}`}>
                        Availability Form
                    </button>
                    <button 
                        onClick={toggleForm} 
                        className={`font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${isAgentFormActive ? 'bg-pink-500 hover:bg-pink-700 text-white' : 'bg-gray-300 text-gray-700'}`}>
                        New Salesperson Form
                    </button>
                </div>
    
                {isAgentFormActive ? (
                    <div className="p-6 rounded-lg shadow-lg bg-white">
                        <h2 className="text-center text-pink-600 text-xl font-bold mb-4">New Agent Form</h2>
                        <p className="text-gray-600 text-base font-medium mb-4 px-4 py-2">Fill out this New Agent form 1 time.</p>
                        <AgentFormAgent />
                    </div>
                ) : (
                    <div className="p-6 rounded-lg shadow-lg bg-white">
                        <h2 className="text-center text-pink-600 text-xl font-bold mb-4">Availability Form</h2>
                        <p className="text-gray-600 text-base font-medium mb-4 px-4 py-2">Fill out this Availability form before each show in your location.</p>
                        <AvailabilityForm 
                            agents={agents} 
                            shows={shows} 
                        />
                    </div>
                )}
            </div>
        </>
    );
    
};

export default FormsAgent;