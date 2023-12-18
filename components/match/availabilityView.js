// AvailabilityView.js
import React from 'react';

const AvailabilityView = ({ availability }) => {
    return (
        <div className="mb-4 p-4 border border-gray-300 rounded shadow">
            <h2 className="font-bold">{availability.agent}</h2>
            <p>Show: {availability.show}</p>
            <p>Available Dates: {availability.availability.join(', ')}</p>
        </div>
    );
};

export default AvailabilityView;
