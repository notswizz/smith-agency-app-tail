import React, { useState } from 'react';

const AvailabilityForm = ({ agents, shows, onAvailabilityAdded }) => {
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedShow, setSelectedShow] = useState('');
    const [isAvailable, setIsAvailable] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const submissionData = {
            agent: selectedAgent,
            show: selectedShow,
            availability: isAvailable, // Renamed from isAvailable to availability
            notes: notes
        };
        console.log('Submitting:', submissionData);
        await onAvailabilityAdded(submissionData);
    };
    

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {/* Agent Dropdown */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agent">
                    Agent:
                </label>
                <select
                    id="agent"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    {agents.map(agent => (
                        <option key={agent._id.$oid} value={agent._id.$oid}>{agent.name}</option>
                    ))}
                </select>
            </div>
    
            {/* Show Dropdown */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="show">
                    Show:
                </label>
                <select
                    id="show"
                    value={selectedShow}
                    onChange={(e) => setSelectedShow(e.target.value)}
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    {shows.map(show => (
                        <option key={show._id.$oid} value={show._id.$oid}>{show.id}</option>
                    ))}
                </select>
            </div>
    
          {/* Yes/No Availability */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability">
                    Are you available?
                </label>
                <select
                    id="availability"
                    value={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.value)}
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
    
            {/* Notes Section */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                    Notes:
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="shadow border rounded py-2 px-3 text-gray-700 w-full"
                    placeholder="Enter any notes here"
                />
            </div>
    
            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Submit
            </button>
        </form>
    );
};

export default AvailabilityForm;