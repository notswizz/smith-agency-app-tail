// File: pages/MasterSheet.js

import React from 'react';


const MasterSheet = ({ bookings }) => {
    const getTotalDays = (agentCounts) => {
        return Array.isArray(agentCounts) ? agentCounts.reduce((a, b) => a + b, 0) : 0;
    };

    const compileAgentCounts = (agentSelection) => {
        return agentSelection.flat().reduce((acc, agent) => {
            if (agent) {
                acc[agent] = (acc[agent] || 0) + 1;
            }
            return acc;
        }, {});
    };

    return (
        <div className="print p-8">
            {bookings.map(booking => {
                const totalDays = getTotalDays(booking.agentCounts);
                const agentCounts = compileAgentCounts(booking.agentSelection);
                return (
                    <div key={booking._id} className="mb-5 p-4 border border-gray-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{booking.client} - {booking.location}</h2>
                        <p className="mb-1 font-medium">Show: <span className="text-gray-600">{booking.show}</span></p>
                        <p className="mb-1 font-medium">Start: <span className="text-gray-600">{booking.startDate}</span> - End: <span className="text-gray-600">{booking.endDate}</span></p>
                        <p className="mb-1 font-medium">Total Days: <span className="text-gray-600">{totalDays}</span></p>
                        <p className="mb-3 font-medium">Notes: <span className="text-gray-600">{booking.notes}</span></p>
                        <div className="agent-counts grid grid-cols-2 gap-1">
                            {Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).map(([agent, count]) => (
                                <p key={agent} className="text-sm px-2 py-1 border border-gray-200 rounded">
                                    {agent}: {count}
                                </p>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MasterSheet;
