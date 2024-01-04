import React, { useState, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ agents, shows, onAvailabilityAdded }) => {
    const [agentPhone, setAgentPhone] = useState(''); 
    const [selectedShow, setSelectedShow] = useState('');
    const [selectedDays, setSelectedDays] = useState({});
    const [showDateRange, setShowDateRange] = useState({ startDate: '', endDate: '' });
    const [notes, setNotes] = useState(''); 
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionFailure, setSubmissionFailure] = useState(false);

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
    
        const selectedDates = Object.keys(selectedDays).filter(date => selectedDays[date]);
    
        if (selectedDates.length === 0) {
            console.error('No dates selected');
            setSubmissionFailure(true); 
            return;
        }
    
        let allUpdatesSuccessful = true;
    
        for (const date of selectedDates) {
            // Change the API endpoint to 'createAvailability'
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
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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

                {/* Date Checkboxes */}
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

                {/* Success and Failure Notifications */}
                {submissionSuccess && (
                    <div className="alert alert-success">Form submitted successfully!</div>
                )}
                {submissionFailure && (
                    <div className="alert alert-danger">Failed to submit the form. Please try again.</div>
                )}
            </form>
        </div>
    );
};

export default AvailabilityForm;
