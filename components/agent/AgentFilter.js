import React, { useState, useEffect } from 'react';

const AgentFilter = ({ onFilterChange, filteredAgentCount }) => {
    const [nameFilter, setNameFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [locations, setLocations] = useState([]); // State to store locations

    useEffect(() => {
        // Fetch locations from the backend or define them statically
        const availableLocations = ['ATL', 'NYC', 'LA', 'DAL']; // Example locations
        setLocations(availableLocations);

        // Alternatively, fetch locations from your backend if they are dynamic
    }, []);

    const handleNameFilterChange = (e) => {
        setNameFilter(e.target.value);
        onFilterChange({ name: e.target.value, location: locationFilter });
    };

    const handleLocationFilterChange = (e) => {
        setLocationFilter(e.target.value);
        onFilterChange({ name: nameFilter, location: e.target.value });
    };

    return (
        <div className="agent-filters flex flex-col space-y-2 mb-4">
            <input 
                type="text" 
                placeholder="Filter by Agent Name" 
                value={nameFilter} 
                onChange={handleNameFilterChange}
                className="border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <select 
                value={locationFilter} 
                onChange={handleLocationFilterChange}
                className="border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
                <option value="">Filter by Location</option>
                {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                ))}
            </select>
            <div className="text-sm text-gray-600">
                Showing {filteredAgentCount} Agents
            </div>
        </div>
    );
};

export default AgentFilter;
