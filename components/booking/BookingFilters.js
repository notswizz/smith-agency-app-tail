import React, { useState, useEffect } from 'react';

const BookingFilters = ({ onFilterChange, filteredCount }) => {
    const [clientFilter, setClientFilter] = useState('');
    const [showFilter, setShowFilter] = useState('');
    const [shows, setShows] = useState([]); // State to store shows

    useEffect(() => {
        // Fetch shows from the backend
        const fetchShows = async () => {
            const response = await fetch('/api/shows/getShows'); // Adjust the API endpoint as needed
            const data = await response.json();
            setShows(data);
        };

        fetchShows();
    }, []);

    const handleClientFilterChange = (e) => {
        setClientFilter(e.target.value);
        onFilterChange({ client: e.target.value, show: showFilter });
    };

    const handleShowFilterChange = (e) => {
        setShowFilter(e.target.value);
        onFilterChange({ client: clientFilter, show: e.target.value });
    };

    return (
        <div className="booking-filters flex flex-col space-y-2 mb-4">
            <input 
                type="text" 
                placeholder="Filter by Client" 
                value={clientFilter} 
                onChange={handleClientFilterChange}
                className="border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <select 
                value={showFilter} 
                onChange={handleShowFilterChange}
                className="border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
                <option value="">Filter by Show</option>
                {shows.filter(show => show.active).map((show) => (
                    <option key={show.id} value={show.id}>{show.id}</option> // Adjust according to your show object structure
                ))}
            </select>
            <div className="text-sm text-gray-600">
                Showing {filteredCount} bookings
            </div>
        </div>
    );
    
};

export default BookingFilters;