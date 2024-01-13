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

    useEffect(() => {
        if (session) {
            setAgent(agent => ({ ...agent, email: session.user.email }));
        }
    }, [session]);


    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                setExistingAgents(data);
            } else {
                console.error('Failed to fetch agents');
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const handleChange = (e) => {
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
        e.preventDefault();
    
        const formData = new FormData();
        for (const key in agent) {
            if (key === 'resume' && agent[key]) {
                formData.append(key, agent[key], agent[key].name); // Add resume file to formData
            } else {
                formData.append(key, agent[key]);
            }
        }
    
        try {
            const response = await fetch('/api/agents/addAgent', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const newAgent = await response.json();
                alert('Agent added successfully!');
    
                // Invoke callback function if provided
                onAgentAdded && onAgentAdded(newAgent);
    
                // Reset form fields
                setAgent({ name: '', email: '', phone: '', location: [], instagram: '', college:'', shoeSize:'', salesExperience:'', clothingSize:'', resume: null, image: null });
    
                // Fetch updated list of agents
                fetchAgents();
            } else {
                const errorData = await response.json();
                console.error('Failed to add agent', errorData);
                alert(`Failed to add agent: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            alert('An error occurred while adding the agent.');
        }
    };

    
    
    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow max-h-96 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">New Agent Profile</h2>
            <p className="text-gray-600 mb-6">
                Welcome to the agent onboarding form. Please complete the following details to create a new agent profile. Fields marked with an asterisk (*) are required.
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
                        <small className="text-gray-500">Hold down the Ctrl (Windows) / Command (Mac) button to select multiple options.</small>
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
                <input 
                    type="text" 
                    id="salesExperience" 
                    name="salesExperience" 
                    value={agent.salesExperience} 
                    onChange={handleChange} 
                    placeholder="Sales Experience"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
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
    
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                            Profile Image:
                        </label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image" 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                        <small className="text-gray-500">Choose a clear, professional headshot if available.</small>
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