import React, { useState, useEffect, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ shows, onAvailabilityAdded }) => {
    const [agents, setAgents] = useState([]);
    const [agentPhone, setAgentPhone] = useState(''); 
    const [selectedShow, setSelectedShow] = useState('');
    const [selectedDays, setSelectedDays] = useState({});
    const [showDateRange, setShowDateRange] = useState({ startDate: '', endDate: '' });
    const [notes, setNotes] = useState(''); 
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionFailure, setSubmissionFailure] = useState(false);

    useEffect(() => {
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
        fetchAgents();
    }, []);

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


    const dateCheckboxes = useMemo(() => {
        const { startDate, endDate } = showDateRange;
        const dateRange = generateDateRange(startDate, endDate);
        return dateRange.map(date => ({
            date,
            checked: selectedDays[date] || false,
        }));
    }, [showDateRange, selectedDays]);

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

    const sortedShows = useMemo(() => {
        return [...shows].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [shows]);

    const handleDateCheckboxChange = (date) => {
        setSelectedDays(prevSelectedDays => ({
            ...prevSelectedDays,
            [date]: !prevSelectedDays[date],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionFailure(false);
        setSubmissionSuccess(false);
    
        // Check if agentPhone exists in agents array
        const agentExists = agents.some(agent => agent.phone === agentPhone);
    
        if (!agentExists) {
            console.error('Agent phone number does not match any agent records');
            setSubmissionFailure(true);
            return;
        }
    
        // Extract the selected dates
        const selectedDates = Object.keys(selectedDays).filter(date => selectedDays[date]);
    
        let allUpdatesSuccessful = true;
    
        for (const date of selectedDates) {
            const response = await fetch('/api/availability/createAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agentPhone, dateToBook: date })
            });
    
            if (!response.ok) {
                console.error('Failed to create availability for date:', date);
                allUpdatesSuccessful = false;
                break;
            }
        }
    
        if (allUpdatesSuccessful) {
            setSubmissionSuccess(true);
            setAgentPhone('');
            setSelectedShow('');
            setSelectedDays({});
            setNotes('');
            onAvailabilityAdded && onAvailabilityAdded();
        } else {
            setSubmissionFailure(true); 
        }
    };
    
    
    return (
        <div className="max-w-md mx-auto max-h-96 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Agent Availability Submission</h2>
            <p className="text-gray-600 mb-6">
                Use this form to update an agent's availability for upcoming shows. Ensure the phone number is accurate to properly record the dates.
            </p>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Agent Phone Number Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agentPhone">
                        Phone Number*:
                    </label>
                    <input
    type="tel"
    id="agentPhone"
    value={agentPhone}
    onChange={(e) => setAgentPhone(e.target.value)}
    placeholder="9 digits, no dashes or slashes"
    pattern="\d*"
    title="Please enter a 9 digit phone number without any dashes or slashes."
    maxLength="9"
    required
    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
/>

                </div>
    
                {/* Show Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="show">
                        Select Show*:
                    </label>
                    <select
                        id="show"
                        value={selectedShow}
                        onChange={(e) => handleShowSelection(e.target.value)}
                        required
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="" disabled>Select a show from the list</option>
                        {sortedShows.map(show => (
                            <option key={show._id} value={show._id}>{show.id}</option>
                        ))}
                    </select>
                </div>
    
                {/* Date Checkboxes */}
                <fieldset className="mb-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Available Dates*:</legend>
                    {dateCheckboxes.map(({ date, checked }) => (
                        <label key={date} className="block">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleDateCheckboxChange(date)}
                                className="mr-2 leading-tight"
                            />
                            {toUTCDateString(date)}
                        </label>
                    ))}
                </fieldset>
    
                {/* Notes Section */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                        Additional Notes:
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        placeholder="Include any specific details or preferences"
                        className="shadow border rounded py-2 px-3 text-gray-700 w-full"
                    />
                </div>
    
                {/* Submit Button */}
                <div className="flex justify-center">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit Availability
                    </button>
                </div>
    
                {/* Success and Failure Notifications */}
                {submissionSuccess && (
                    <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> The availability has been successfully submitted.</span>
                    </div>
                )}
                {submissionFailure && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> There was a problem submitting the availability. Please try again.</span>
                    </div>
                )}
            </form>
        </div>
    );
    
   
};

export default AvailabilityForm;
