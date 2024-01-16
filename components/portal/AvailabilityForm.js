import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from "next-auth/react"; // Import useSession hook to get user session
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ shows, onAvailabilityAdded }) => {
    console.log('AvailabilityForm component rendered');
    const { data: session } = useSession(); // Retrieve session data
    console.log('Session data:', session);
    const [selectedShow, setSelectedShow] = useState('');
    const [selectedDays, setSelectedDays] = useState({});
    const [showDateRange, setShowDateRange] = useState({ startDate: '', endDate: '' });
    const [notes, setNotes] = useState(''); 
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionFailure, setSubmissionFailure] = useState(false);

    const generateDateRange = (start, end) => {
        console.log('generateDateRange invoked with start:', start, 'end:', end);
        if (!start || !end) return [];
        let currentDate = new Date(start);
        const endUTCDate = new Date(end);
        const dates = [];

        while (currentDate <= endUTCDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        console.log('Generated date range:', dates);
        return dates;
    };

    const dateCheckboxes = useMemo(() => {
        console.log('dateCheckboxes useMemo invoked');
        const { startDate, endDate } = showDateRange;
        const dateRange = generateDateRange(startDate, endDate);
        return dateRange.map(date => ({
            date,
            checked: selectedDays[date] || false,
        }));
    }, [showDateRange, selectedDays]);

    const handleShowSelection = (showId) => {
        console.log('handleShowSelection invoked with showId:', showId);
        const show = shows.find(show => show._id === showId);
        if (show) {
            console.log('Show found:', show);
            setShowDateRange({
                startDate: show.startDate,
                endDate: show.endDate
            });
            setSelectedShow(showId);
        } else {
            console.log('No show found with the specified id');
            setShowDateRange({ startDate: '', endDate: '' });
            setSelectedShow('');
        }
    };

    const sortedShows = useMemo(() => {
        console.log('sortedShows useMemo invoked');
        if (!Array.isArray(shows)) {
            return []; // or return a default value that makes sense in your context
        }
        return [...shows].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [shows]);

    const handleDateCheckboxChange = (date) => {
        console.log('handleDateCheckboxChange invoked with date:', date);
        setSelectedDays(prevSelectedDays => ({
            ...prevSelectedDays,
            [date]: !prevSelectedDays[date],
        }));
    };

    const handleSubmit = async (event) => {
        console.log('handleSubmit invoked');
        event.preventDefault();
        setSubmissionFailure(false);
        setSubmissionSuccess(false);

        // Use the email from session for identifying the agent
        const agentEmail = session.user.email;
        console.log('Agent email:', agentEmail);

        // Fetch the agent's details
        console.log('Fetching agent details');
        const agentResponse = await fetch(`/api/agents/getAgentByEmail?email=${encodeURIComponent(agentEmail)}`);
        const agentData = await agentResponse.json();
        console.log('Agent data:', agentData);

        if (!agentData || !agentData._id) {
            console.error('Failed to fetch agent details');
            setSubmissionFailure(true);
            return; // Stop the function if fetching agent details fails
        }

        // Extract the selected dates
        const selectedDates = Object.keys(selectedDays).filter(date => selectedDays[date]);
        console.log('Selected dates:', selectedDates);

        let allUpdatesSuccessful = true;

        for (const date of selectedDates) {
            console.log('Creating availability for date:', date);
            const response = await fetch('/api/availability/createAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agentEmail, dateToBook: date, notes }) // Send the email and notes
            });

            if (!response.ok) {
                console.error('Failed to create availability for date:', date);
                allUpdatesSuccessful = false;
                break;
            }
        }

        if (allUpdatesSuccessful) {
            console.log('All updates successful');
            setSubmissionSuccess(true);
            setSelectedShow('');
            setSelectedDays({});
            setNotes('');
            onAvailabilityAdded && onAvailabilityAdded();
        } else {
            console.log('Not all updates were successful');
            setSubmissionFailure(true); 
        }
    };

    
  
return (
    <div className="flex flex-col min-h-screen py-1 bg-gray-100">
        <div className="flex flex-col w-full max-w-2xl bg-white shadow-2xl rounded-lg p-8 sm:p-6 mx-auto border-4 border-indigo-500">
            <h2 className="text-3xl font-bold mb-4 text-center text-indigo-500">Availability Form</h2>
            <p className="text-gray-600 mb-3 text-center text-md">
                Submit before each show!
            </p>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                    <label htmlFor="show" className="block text-gray-700 text-sm font-bold mb-2">Select Show*:</label>
                    <div className="relative">
                        <select
                            id="show"
                            value={selectedShow}
                            onChange={(e) => handleShowSelection(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none appearance-none"
                        >
                            <option value="" disabled>Select a show</option>
                            {shows.map(show => (
                                <option key={show._id} value={show._id}>
                                    {show.type} in {show.location} ({toUTCDateString(show.startDate)} - {toUTCDateString(show.endDate)})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.305 7.695a.999.999 0 0 1 1.414 0L10 11.076l3.28-3.381a.999.999 0 1 1 1.44 1.402l-4 4a.999.999 0 0 1-1.44 0l-4-4a.997.997 0 0 1 0-1.402z"/></svg>
                        </div>
                    </div>
                </div>
                <fieldset className="mb-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Available Dates*:</legend>
                    {dateCheckboxes.map(({ date, checked }) => (
                        <label key={date} className="block mb-2">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleDateCheckboxChange(date)}
                                className="mr-2 leading-tight h-6 w-6"
                            />
                            {toUTCDateString(date)}
                        </label>
                    ))}
                </fieldset>
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
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit Availability
                    </button>
                </div>
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
    </div>
);

    
   
};

export default AvailabilityForm;
