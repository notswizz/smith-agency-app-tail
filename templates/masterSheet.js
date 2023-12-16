// File: templates/masterSheet.js

import React from 'react';

const MasterSheet = ({ bookings }) => {
    return (
        <div>
            {/* Render booking information here */}
            {bookings.map(booking => (
                <div key={booking._id.$oid}>
                    <h2>{booking.client}</h2>
                    {/* More booking details */}
                </div>
            ))}
        </div>
    );
};

export default MasterSheet;
