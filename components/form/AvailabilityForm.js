import React, { useState, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils';

const AvailabilityForm = ({ agents, shows, onAvailabilityAdded }) => {
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedShow, setSelectedShow] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
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

    // useMemo hook to create date checkboxes
    const dateCheckboxes = useMemo(() => {
        const dateRange = generateDateRange(startDate, endDate);
        return dateRange.map(date => ({
            date,
            checked: selectedDays[date] || false,
        }));
    }, [startDate, endDate, selectedDays]);

   // Handle show selection and update date range
const handleShowSelection = (showId) => {
    const selectedShow = shows.find(show => show._id === showId);
    if (selectedShow) {
        setShowDateRange({
            startDate: selectedShow.startDate,
            endDate: selectedShow.endDate
        });
        setSelectedShow(showId);
    } else {
        // Reset the selected show and date range if no show is found
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
        const availabilityArray = Object.entries(selectedDays)
            .filter(([date, isChecked]) => isChecked)
            .map(([date]) => date);

        const submissionData = {
            agent: selectedAgent,
            show: selectedShow,
            availability: availabilityArray,
            notes: notes
        };

        try {
            const response = await fetch('/api/availability/addAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                setSubmissionSuccess(true); //
                // Reset form on successful submission
                setSelectedAgent('');
                setSelectedShow('');
                setStartDate('');
                setEndDate('');
                setSelectedDays({});
                setNotes('');
            } else {
                console.error('Submission was not successful:', await response.json());
            }
        } catch (error) {
            console.error('Error occurred during form submission:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto max-h-96 overflow-auto"> {/* Adjust the max-width as needed */}
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
                    <option value="" disabled>Select an agent...</option> {/* Default option */}
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
        onChange={(e) => handleShowSelection(e.target.value)}
        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
        <option value="" disabled>Select a show...</option>
        {shows.map(show => (
            <option key={show._id} value={show._id}>{show.id}</option> // Ensure the correct key and value are set
        ))}
    </select>
</div>

           


{/* Start Date Input */}
<div className="mb-4">
    <label htmlFor="start-date" className="block text-gray-700 text-sm font-bold mb-2">
        Start Date:
    </label>
    <input 
        type="date" 
        id="start-date" 
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        min={showDateRange.startDate || '2023-01-01'}
        max={showDateRange.endDate || '2099-12-31'}
        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
</div>

{/* End Date Input */}
<div className="mb-4">
    <label htmlFor="end-date" className="block text-gray-700 text-sm font-bold mb-2">
        End Date:
    </label>
    <input 
        type="date" 
        id="end-date" 
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={showDateRange.startDate || '2023-01-01'}
        max={showDateRange.endDate || '2099-12-31'}
        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
</div>


    {/* Dynamically Created Checkboxes */}
             {/* Dynamically Created Checkboxes */}
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
