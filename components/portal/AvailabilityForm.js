import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from "next-auth/react"; // Import useSession hook to get user session
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ shows, onAvailabilityAdded }) => {
    const { data: session } = useSession(); // Retrieve session data
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
        if (!Array.isArray(shows)) {
            return []; // or return a default value that makes sense in your context
        }
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
    
        // Use the email from session for identifying the agent instead of phone number
        const agentEmail = session.user.email;
    
        // Extract the selected dates
        const selectedDates = Object.keys(selectedDays).filter(date => selectedDays[date]);
    
        let allUpdatesSuccessful = true;
    
        for (const date of selectedDates) {
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
            setSubmissionSuccess(true);
       
            setSelectedShow('');
            setSelectedDays({});
            setNotes('');
            onAvailabilityAdded && onAvailabilityAdded();
        } else {
            setSubmissionFailure(true); 
        }
    };
    
  
  return (
    <div className="flex flex-col min-h-screen py-1">
        <div className="flex flex-col w-full max-w-2xl bg-white shadow-md rounded-lg p-2 sm:p-1 mx-auto">
            <h2 className="text-xl font-bold mb-2 text-center">Sales Rep Availability Form</h2>
            <p className="text-gray-600 mb-3 text-center">
                    Use this form to update your availability for upcoming shows.
                </p>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="show" className="block text-gray-700 text-sm font-bold mb-2">Select Show*:</label>
                        <select
                            id="show"
                            value={selectedShow}
                            onChange={(e) => handleShowSelection(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        >
                            <option value="" disabled>Select a show</option>
                            {shows.map(show => (
                                <option key={show._id} value={show._id}>
                                    {show.type} in {show.location} ({toUTCDateString(show.startDate)} - {toUTCDateString(show.endDate)})
                                </option>
                            ))}
                        </select>
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
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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
