import React, { useState, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ agents, shows, onAvailabilityAdded }) => {
    const [agentName, setAgentName] = useState('');
    const [agentPhone, setAgentPhone] = useState('');
    const [selectedShow, setSelectedShow] = useState('');
    const [selectedDays, setSelectedDays] = useState({});
    const [showDateRange, setShowDateRange] = useState({ startDate: '', endDate: '' });
    const [notes, setNotes] = useState(''); 
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionFailure, setSubmissionFailure] = useState(false); // New state variable

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

    // Sort shows by startDate
    const sortedShows = useMemo(() => {
        return [...shows].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [shows]);

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
        setSubmissionFailure(false); 
    
        const availabilityDates = Object.keys(selectedDays).filter(date => selectedDays[date]);
    
        // Make sure some dates are selected
        if (availabilityDates.length === 0) {
            console.error('No dates selected');
            return;
        }
    
        const submissionData = {
            agentPhone, // Assuming the API uses only the phone to identify the agent
            availability: availabilityDates,
        };
    
        const response = await fetch('/api/availability/updateAvailability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });
    

        if (response.ok) {
            setSubmissionSuccess(true);
            setAgentName('');
            setAgentPhone('');
            setSelectedShow('');
            setSelectedDays({});
            setNotes('');
        } else {
            console.error('Submission was not successful:', await response.json());
            setSubmissionFailure(true); 
        }
    };


    return (
        <div className="max-w-md mx-auto max-h-96 overflow-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Agent Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agentName">
                        Agent Name:
                    </label>
                    <input
                        type="text"
                        id="agentName"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="Agent Name"
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                {/* Agent Phone Number Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agentPhone">
                        Agent Phone:
                    </label>
                    <input
                        type="tel"
                        id="agentPhone"
                        value={agentPhone}
                        onChange={(e) => setAgentPhone(e.target.value)}
                        placeholder="Agent Phone Number"
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
                        {sortedShows.map(show => (
                            <option key={show._id} value={show._id}>{show.id}</option>
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
                            {toUTCDateString(date)}
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

                {/* Failure Notification */}
                {submissionFailure && (
                    <div className="alert alert-danger">Failed to submit the form. Please try again.</div>
                )}
            </form>
        </div>
    );
};

export default AvailabilityForm;