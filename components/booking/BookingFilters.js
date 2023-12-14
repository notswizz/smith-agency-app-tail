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
        <div className="booking-filters">
            <input 
                type="text" 
                placeholder="Filter by Client" 
                value={clientFilter} 
                onChange={handleClientFilterChange} 
            />
            <input 
                type="text" 
                placeholder="Filter by Show" 
                value={showFilter} 
                onChange={handleShowFilterChange} 
            />
            {/* Add more inputs/dropdowns for additional filters */}
        </div>
    );
};

export default BookingFilters;
