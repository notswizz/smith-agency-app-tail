import React, { useState, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ agents, shows, onAvailabilityAdded }) => {
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedShow, setSelectedShow] = useState('');
    const [agentId, setAgentId] = useState('');
    const [selectedDays, setSelectedDays] = useState({});
    const [showDateRange, setShowDateRange] = useState({ startDate: '', endDate: '' });
    const [notes, setNotes] = useState(''); // Add this line to declare the notes state
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Function to generate a range of dates
    const generateDateRange = (start, end) => {
        if (!start || !end) return [];
        let currentDate = new Date(start);
        const endUTCDate = new Date(end);
        const dates = [];

        while (currentDate <= endUTCDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        return dates;
    };

    // useMemo hook to create date checkboxes based on the selected show's date range
const dateCheckboxes = useMemo(() => {
    const { startDate, endDate } = showDateRange;
    const dateRange = generateDateRange(startDate, endDate);
    return dateRange.map(date => ({
        date,
        checked: selectedDays[date] || false,
    }));
}, [showDateRange, selectedDays]);

// Handle show selection and update date range
const handleShowSelection = (showId) => {
    const show = shows.find(show => show._id === showId);
    if (show) {
        setShowDateRange({
            startDate: show.startDate,
            endDate: show.endDate
        });
        setSelectedShow(showId);
    } else {
        setShowDateRange({ startDate: '', endDate: '' });
        setSelectedShow('');
    }
};


    // Handle date checkbox change
    const handleDateCheckboxChange = (date) => {
        setSelectedDays(prevSelectedDays => ({
            ...prevSelectedDays,
            [date]: !prevSelectedDays[date],
        }));
    };

// Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
    const uppercaseAgentId = agentId.toUpperCase();

    // Verify the Agent ID
    try {
        const verifyResponse = await fetch(`/api/agents/verifyAgent?agentId=${uppercaseAgentId}`);
        if (verifyResponse.ok) {
            const agentData = await verifyResponse.json();
            
            if (agentData) {
                // If the agent exists, use the agent's name in the submission data
                const submissionData = {
                    agent: agentData.name, // Using agent's name
                    show: selectedShow,
                    availability: Object.entries(selectedDays)
                        .filter(([date, isChecked]) => isChecked)
                        .map(([date]) => date),
                    notes: notes
                };

                // Submit the availability data
                const response = await fetch('/api/availability/addAvailability', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                });

                if (response.ok) {
                    setSubmissionSuccess(true);
                    // Reset form on successful submission
                    setSelectedAgent('');
                    setSelectedShow('');
                    setSelectedDays({});
                    setNotes('');
                } else {
                    console.error('Submission was not successful:', await response.json());
                }
            } else {
                alert('Agent ID does not exist.');
            }
        } else {
            alert('Error verifying Agent ID.');
        }
    } catch (error) {
        console.error('Error occurred during agent ID verification:', error);
    }
};


     return (
        <div className="max-w-md mx-auto max-h-96 overflow-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                
                {/* Agent ID Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agentId">
                        Agent ID:
                    </label>
                    <input
                        type="text"
                        id="agentId"
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        placeholder="Agent ID (AB001)"
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

         {/* Show Dropdown */}
<div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="show">
        Show:
    </label>
    <select
        id="show"
        value={selectedShow}
        onChange={(e) => handleShowSelection(e.target.value)}
        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
        <option value="" disabled>Select a show...</option>
        {shows.map(show => (
            <option key={show._id} value={show._id}>{show.id}</option> // Ensure the correct key and value are set
        ))}
    </select>
</div>

           




      {/* Dynamically Created Date Checkboxes */}
      <fieldset className="mb-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Select Days:</legend>
                    {dateCheckboxes.map(({ date, checked }) => (
                        <label key={date} className="block">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleDateCheckboxChange(date)}
                                className="mr-2 leading-tight"
                            />
                            {date}
                        </label>
                    ))}
                </fieldset>

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

                {/* Success Notification */}
                {submissionSuccess && (
                    <div className="alert alert-success">Form submitted successfully!</div>
                )}
        </form>
        </div>
    );
};

export default AvailabilityForm;
