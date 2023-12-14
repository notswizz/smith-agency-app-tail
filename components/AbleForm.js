import React, { useState, useEffect } from 'react';

const AbleForm = () => {
    // State for shows, selected show, and agent's availability
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [availability, setAvailability] = useState({});

    // Fetch shows from the API
    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await fetch('/api/shows/getShows');
                if (response.ok) {
                    const data = await response.json();
                    setShows(data);
                } else {
                    console.error('Failed to fetch shows');
                }
            } catch (error) {
                console.error('Error fetching shows:', error);
            }
        };
        fetchShows();
    }, []);

    // Generate all dates between two dates
    const getAllDatesBetween = (startDate, endDate) => {
        let dates = [];
        let currentDate = new Date(startDate);
        let lastDate = new Date(endDate);
        while (currentDate <= lastDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    // Handle show selection
    const handleShowSelect = (event) => {
        const showId = event.target.value;
        const selected = shows.find(show => show._id === showId);
        setSelectedShow(selected);

        // Reset availability for new show
        setAvailability({});
    };

    // Handle checkbox change
    const handleCheckboxChange = (date) => {
        setAvailability(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    // Render dropdown for shows
    const renderShowsDropdown = () => {
        return (
            <select onChange={handleShowSelect} value={selectedShow ? selectedShow._id : ''}>
                <option value=''>Select a Show</option>
                {shows.map(show => (
                    <option key={show._id} value={show._id}>{show.location} - {show.season} - {show.type}</option>
                ))}
            </select>
        );
    };

    // Generate checkboxes for each date of the selected show
    const renderAvailabilityCheckboxes = () => {
        if (!selectedShow || !selectedShow.startDate || !selectedShow.endDate) return null;

        const dateRange = getAllDatesBetween(selectedShow.startDate, selectedShow.endDate);
        return (
            <div>
                {dateRange.map(date => (
                    <label key={date}>
                        <input 
                            type='checkbox' 
                            checked={availability[date] || false}
                            onChange={() => handleCheckboxChange(date)}
                        />
                        {date}
                    </label>
                ))}
            </div>
        );
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Process and send availability data to backend
        console.log('Submitted Availability:', availability);
    };

    return (
        <form onSubmit={handleSubmit}>
            {renderShowsDropdown()}
            {selectedShow && renderAvailabilityCheckboxes()}
            <button type='submit'>Submit Availability</button>
        </form>
    );
};

export default AbleForm;
