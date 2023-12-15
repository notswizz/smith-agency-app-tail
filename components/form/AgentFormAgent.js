import React, { useState } from 'react';

const AgentFormAgent = ({ onAgentAdded }) => {
    // Include 'notes' in the initial state
    const [agent, setAgent] = useState({ name: '', email: '', phone: '', location: [], instagram: '', notes: '' });

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
        } else {
            setAgent({ ...agent, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/agents/addAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agent),
            });

            if (response.ok) {
                const newAgent = await response.json();
                alert('Agent added successfully!');
                if (onAgentAdded) {
                    onAgentAdded(newAgent);
                }
                // Reset form fields including 'notes'
                setAgent({ name: '', email: '', phone: '', location: [], instagram: '', notes: '' });
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
                <div className="mb-6">
                    <label htmlFor="instagram" className="block text-gray-700 text-sm font-bold mb-2">Instagram:</label>
                    <input type="text" id="instagram" name="instagram" value={agent.instagram} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
               
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Agent</button>
            </form>
        </div>
    );
};

export default AgentFormAgent;