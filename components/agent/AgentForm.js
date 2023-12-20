import React, { useState, useEffect } from 'react';

const AgentForm = ({ onAgentAdded }) => {
    const [agent, setAgent] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        location: [], 
        instagram: '', 
        notes: '', 
        college: '', 
        shoeSize: '', 
        image: null 
    });
    const [existingAgents, setExistingAgents] = useState([]);

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

    const generateAgentId = (name) => {
        const initials = name.split(' ').map(part => part[0].toUpperCase()).join('');
        let count = 1;
    
        existingAgents.forEach(existingAgent => {
            // Check if agent_id exists and then if it starts with the initials
            if (existingAgent.agent_id && existingAgent.agent_id.startsWith(initials)) {
                count++;
            }
        });
    
        return `${initials}${String(count).padStart(3, '0')}`;
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
        } else {
            setAgent({ ...agent, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Generate agent_id here
        const agentId = generateAgentId(agent.name);

        const formData = new FormData();
        for (const key in agent) {
            formData.append(key, agent[key]);
        }
        formData.append('agent_id', agentId);

        try {
            const response = await fetch('/api/agents/addAgent', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newAgent = await response.json();
                alert(`Agent added successfully! Agent ID: ${agentId}`);
                onAgentAdded && onAgentAdded(newAgent);

                // Reset form fields
                setAgent({ name: '', email: '', phone: '', location: [], instagram: '', notes: '', image: null });
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
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input type="text" id="name" name="name" value={agent.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input type="email" id="email" name="email" value={agent.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                    <input type="tel" id="phone" name="phone" value={agent.phone} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                    <select id="location" name="location" multiple value={agent.location} onChange={handleChange} className="shadow border rounded py-2 px-3 text-gray-700 w-full">
                        <option value="ATL">ATL</option>
                        <option value="NYC">NYC</option>
                        <option value="LA">LA</option>
                        <option value="DAL">DAL</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="college" className="block text-gray-700 text-sm font-bold mb-2">College:</label>
                    <input 
                        type="text" 
                        id="college" 
                        name="college" 
                        value={agent.college} 
                        onChange={handleChange} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="shoeSize" className="block text-gray-700 text-sm font-bold mb-2">Shoe Size:</label>
                    <input 
                        type="text" 
                        id="shoeSize" 
                        name="shoeSize" 
                        value={agent.shoeSize} 
                        onChange={handleChange} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="instagram" className="block text-gray-700 text-sm font-bold mb-2">Instagram:</label>
                    <input type="text" id="instagram" name="instagram" value={agent.instagram} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
               
                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                    <input type="file" id="image" name="image" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                        <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
                        <textarea 
                            id="notes" 
                            name="notes" 
                            value={agent.notes} 
                            onChange={handleChange} 
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Agent</button>
            </form>
        </div>
    );
};

export default AgentForm;