import React, { useState, useMemo } from 'react';
import { toUTCDateString } from '../../lib/utils'; // Import the utility function

const AvailabilityForm = ({ agents, shows, onAvailabilityAdded }) => {
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedShow, setSelectedShow] = useState('');
    const [isAvailable, setIsAvailable] = useState('');
    const [notes, setNotes] = useState('');
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDays, setSelectedDays] = useState({});

    const generateDateRange = (start, end) => {
        if (!start || !end) return [];

        let currentDate = new Date(toUTCDateString(start));
        const endUTCDate = new Date(toUTCDateString(end));
        const dates = [];

        while (currentDate <= endUTCDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        
        return dates;
    };

    const dateCheckboxes = useMemo(() => {
        const dateRange = generateDateRange(startDate, endDate);
        return dateRange.map((date) => ({
            date,
            checked: selectedDays[date] || false,
        }));
    }, [startDate, endDate, selectedDays]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Constructing the availability array
        const availabilityArray = Object.entries(selectedDays)
            .filter(([date, isChecked]) => isChecked)
            .map(([date]) => date);

        const submissionData = {
            agent: selectedAgent,
            show: selectedShow,
            availability: availabilityArray, // Use the constructed array
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
                setSubmissionSuccess(true); // Show success notification
                resetFormFields();
            } else {
                console.error('Submission was not successful. Response:', await response.json());
            }
        } catch (error) {
            console.error('Error occurred during form submission:', error);
        }
    };

    const handleDateCheckboxChange = (date) => {
        setSelectedDays(prevSelectedDays => ({
            ...prevSelectedDays,
            [date]: !prevSelectedDays[date],
        }));
    };

    const resetFormFields = () => {
        setSelectedAgent('');
        setSelectedShow('');
        setIsAvailable('');
        setNotes('');
        setStartDate('');
        setEndDate('');
        setSelectedDays({}); // Resetting the selected days
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
                    onChange={(e) => setSelectedShow(e.target.value)}
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="" disabled>Select a show...</option> {/* Default option */}
                    {shows.map(show => (
                        <option key={show._id.$oid} value={show._id.$oid}>{show.id}</option>
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
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
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
            {submissionSuccess && <div className="alert alert-success">Form submitted successfully!</div>}
        </form>
        </div>
    );
};

export default AvailabilityForm;
