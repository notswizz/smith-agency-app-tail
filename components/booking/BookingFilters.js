import React, { useState } from 'react';

const BookingFilters = ({ onFilterChange }) => {
    const [clientFilter, setClientFilter] = useState('');
    const [showFilter, setShowFilter] = useState('');
    // Additional filter states can be added here

    const handleClientFilterChange = (e) => {
        setClientFilter(e.target.value);
        onFilterChange({ client: e.target.value, show: showFilter });
    };

    const handleShowFilterChange = (e) => {
        setShowFilter(e.target.value);
        onFilterChange({ client: clientFilter, show: e.target.value });
    };

    // Add more handlers for additional filters

    return (
        <div className="booking-filters flex justify-end space-x-4 mb-4">
            <input 
                type="text" 
                placeholder="Filter by Client" 
                value={clientFilter} 
                onChange={handleClientFilterChange}
                className="border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <input 
                type="text" 
                placeholder="Filter by Show" 
                value={showFilter} 
                onChange={handleShowFilterChange}
                className="border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {/* Add more inputs/dropdowns for additional filters */}
        </div>
    );
};

export default BookingFilters;
