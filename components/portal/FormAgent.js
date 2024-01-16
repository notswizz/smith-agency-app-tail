import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

const AgentFormAgent = ({ onAgentAdded }) => {
    const { data: session } = useSession();
    const [agent, setAgent] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        location: [], 
        instagram: '', 
        notes: '', 
        college: '', 
        shoeSize: '', 
        salesExperience: '', 
        clothingSize: '', 
        resume: null, 
        image: null 
    });
    const [existingAgents, setExistingAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isAgent, setIsAgent] = useState(true);

    useEffect(() => {
        console.log('Session changed', session);
        if (session) {
            setAgent(agent => {
                console.log('Setting agent email from session', session.user.email);
                return { ...agent, email: session.user.email };
            });
        }
    }, [session]);


    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        console.log('Fetching agents');
        try {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched agents', data);
                setExistingAgents(data);
            } else {
                console.error('Failed to fetch agents');
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const handleChange = (e) => {
        console.log('Change event', e.target.name, e.target.value);
        if (e.target.name === 'location') {
            const options = e.target.options;
            let value = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
            }
            setAgent({ ...agent, location: value });
        } else if (e.target.name === 'image') {
            setAgent({ ...agent, image: e.target.files[0] });
        } else if (e.target.name === 'resume') {
            setAgent({ ...agent, resume: e.target.files[0] }); // Handle resume file
        } else {
            setAgent({ ...agent, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        console.log('Form submit event', e);
        e.preventDefault();
    
        const formData = new FormData();
        // Add all agent fields to formData
        for (const key in agent) {
            formData.append(key, agent[key]);
        }
    
        // Add the admin, client, and agent boolean values to formData
        formData.append('admin', isAdmin);
        formData.append('client', isClient);
        formData.append('agent', isAgent);
    
        // Add the Google profile image URL to formData
        if (session && session.user && session.user.image) {
            formData.append('googleImageUrl', session.user.image);
        }
    
        // Set the loading state to true to indicate processing
        setLoading(true);
        setStatusMessage('Adding agent...');
    
        try {
            const response = await fetch('/api/agents/addAgent', {
                method: 'POST',
                body: formData,
            });
    
            setLoading(false); // Processing done, set loading to false
    
            if (response.ok) {
                const newAgent = await response.json();
                console.log('Agent added successfully', newAgent);
                alert('Agent added successfully!');
    
                // Invoke the callback function if provided
                if (onAgentAdded) {
                    onAgentAdded(newAgent);
                }
    
                // Reset the agent state to clear the form
                setAgent({
                    name: '', 
                    email: '', 
                    phone: '', 
                    location: [], 
                    instagram: '', 
                    notes: '', 
                    college: '', 
                    shoeSize: '', 
                    salesExperience: '', 
                    clothingSize: '', 
                    resume: null, 
                });
    
                // Fetch the updated list of agents
                fetchAgents();
            } else {
                const errorData = await response.json();
                console.error('Failed to add agent', errorData);
                setStatusMessage(`Failed to add agent: ${errorData.message}`);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error occurred:', error);
            setStatusMessage('An error occurred while adding the agent.');
        }
    };

    
    
    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow max-h-96 overflow-auto border-4 border-pink-500">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">New TSA Sales Rep Form</h2>
            <p className="text-gray-700 text-md mb-6">
                Welcome to the New Sales Rep onboarding form. Please complete the following details to create your profile.
            </p>
    
            {loading ? (
                <div className="flex justify-center items-center">
                    <p>{statusMessage}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Name*:
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={agent.name} 
                            onChange={handleChange} 
                            required 
                            placeholder="Full Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
    
                  
    
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                            Phone*:
                        </label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={agent.phone} 
                            onChange={handleChange} 
                            required 
                            placeholder="Phone Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
    
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                            Location*:
                        </label>
                        <select 
                            id="location" 
                            name="location" 
                            multiple 
                            value={agent.location} 
                            onChange={handleChange} 
                            required 
                            className="shadow border rounded py-2 px-3 text-gray-700 w-full"
                        >
                            <option value="ATL">Atlanta (ATL)</option>
                            <option value="NYC">New York City (NYC)</option>
                            <option value="LA">Los Angeles (LA)</option>
                            <option value="DAL">Dallas (DAL)</option>
                        </select>
                    </div>
    
                    <div className="mb-4">
                        <label htmlFor="college" className="block text-gray-700 text-sm font-bold mb-2">
                            College:
                        </label>
                        <input 
                            type="text" 
                            id="college" 
                            name="college" 
                            value={agent.college} 
                            onChange={handleChange} 
                            placeholder="College"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
                    <div className="mb-4">
                <label htmlFor="clothingSize" className="block text-gray-700 text-sm font-bold mb-2">
                    Clothing Size (0-14):
                </label>
                <input 
                    type="number" 
                    id="clothingSize" 
                    name="clothingSize" 
                    value={agent.clothingSize} 
                    onChange={handleChange} 
                    min="0" 
                    max="14"
                    placeholder="Clothing Size"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                />
            </div>
                    <div className="mb-4">
                        <label htmlFor="shoeSize" className="block text-gray-700 text-sm font-bold mb-2">
                            Shoe Size:
                        </label>
                        <input 
                            type="text" 
                            id="shoeSize" 
                            name="shoeSize" 
                            value={agent.shoeSize} 
                            onChange={handleChange} 
                            placeholder="Shoe Size"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="salesExperience" className="block text-gray-700 text-sm font-bold mb-2">
                            Sales Experience:
                        </label>
                        <textarea
                            id="salesExperience"
                            name="salesExperience"
                            value={agent.salesExperience}
                            onChange={handleChange}
                            placeholder="Sales Experience"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3" // Adjust this value to change the height of the textarea
                        />
                    </div>
            <div className="mb-4">
    <label htmlFor="resume" className="block text-gray-700 text-sm font-bold mb-2">
        Resume:
    </label>
    <input 
        type="file" 
        id="resume" 
        name="resume" 
        onChange={handleChange} 
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
    />
    <small className="text-gray-500">Upload your resume.</small>
</div>

    
                    <div className="mb-4">
                        <label htmlFor="instagram" className="block text-gray-700 text-sm font-bold mb-2">
                            Instagram Handle:
                        </label>
                        <input 
                            type="text" 
                            id="instagram" 
                            name="instagram" 
                            value={agent.instagram} 
                            onChange={handleChange} 
                            placeholder="@"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
    
            
    
                    {!loading && (
                        <button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Add Agent
                        </button>
                    )}
                </form>
            )}
        </div>
    );
    

};

export default AgentFormAgent;