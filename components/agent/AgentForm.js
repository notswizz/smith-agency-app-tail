import React, { useState } from 'react';

const AgentForm = ({ onAgentAdded }) => {
    const [agent, setAgent] = useState({ name: '', email: '', phone: '', location: [], instagram: '' });

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
            const response = await fetch('/api/agents/addAgent', { // Ensure this matches the correct API endpoint
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
                setAgent({ name: '', email: '', phone: '', location: [], instagram: '' }); // Reset form fields
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
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={agent.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={agent.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input type="tel" id="phone" name="phone" value={agent.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <select id="location" name="location" multiple value={agent.location} onChange={handleChange}>
                        <option value="ATL">ATL</option>
                        <option value="NYC">NYC</option>
                        <option value="LA">LA</option>
                        <option value="DAL">DAL</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="instagram">Instagram:</label>
                    <input type="text" id="instagram" name="instagram" value={agent.instagram} onChange={handleChange} />
                </div>
                <button type="submit" className="button">Add Agent</button>
            </form>
        </div>
    );
};

export default AgentForm;
