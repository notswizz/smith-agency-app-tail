// AvailabilityPage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import AvailabilityView from '../components/match/availabilityView'; // Adjust the path as needed
import AvailabilityCalendar from '../components/match/availabilityCalendar';

const AvailabilityPage = () => {
    const [availabilityData, setAvailabilityData] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            const response = await fetch('/api/availability/getAvailability');
            if (response.ok) {
                const data = await response.json();
                setAvailabilityData(data);
            } else {
                console.error('Failed to fetch availability');
            }
        };

        fetchAvailability();
    }, []);

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-xl font-bold mb-4">Agent Availability</h1>
                <AvailabilityCalendar availabilityData={availabilityData} />
                {availabilityData.length > 0 ? (
                    <div>
                        {availabilityData.map((availability, index) => (
                            <AvailabilityView key={index} availability={availability} />
                        ))}
                    </div>
                ) : (
                    <p>No availability data available.</p>
                )}
            </div>
        </>
    );
};

export default AvailabilityPage;
