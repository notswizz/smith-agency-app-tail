import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Stats = () => {
    const [bookingCountData, setBookingCountData] = useState({ labels: [], datasets: [] });
    const [totalDaysData, setTotalDaysData] = useState({ labels: [], datasets: [] });
    const [clientCount, setClientCount] = useState(0);
    const [agentCount, setAgentCount] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0); // State for total bookings count



    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings/getBookings');
                if (!response.ok) throw new Error('Network response was not ok');
                const bookings = await response.json();
                setTotalBookings(bookings.length); // Set the total number of bookings
                processBookingData(bookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('/api/clients/getClients');
                if (!response.ok) throw new Error('Network response was not ok');
                const clients = await response.json();
                setClientCount(clients.length);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch('/api/agents/getAgents');
                if (!response.ok) throw new Error('Network response was not ok');
                const agents = await response.json();
                setAgentCount(agents.length);
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };

        fetchAgents();
    }, []);

    const processBookingData = (bookings) => {
        const showCounts = {};
        const totalDaysPerShow = {};

        bookings.forEach(booking => {
            const show = booking.show;
            const days = booking.totalDays || 0;

            showCounts[show] = (showCounts[show] || 0) + 1;
            totalDaysPerShow[show] = (totalDaysPerShow[show] || 0) + days;
        });

        setBookingCountData({
            labels: Object.keys(showCounts),
            datasets: [{
                label: '# of Bookings',
                data: Object.values(showCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        });

        setTotalDaysData({
            labels: Object.keys(totalDaysPerShow),
            datasets: [{
                label: 'Total Days',
                data: Object.values(totalDaysPerShow),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        });
    };

    return (
        <div>
             <div className="container mx-auto p-4">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Total Clients</h2>
                <p className="text-lg text-blue-600 mt-2">{clientCount}</p>
            </div>
            <div className="container mx-auto p-4">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Total Agents</h2>
                <p className="text-lg text-green-600 mt-2">{agentCount}</p>
            </div>
            <div className="container mx-auto p-4">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Total Bookings:</h2>
                <p className="text-lg text-pink-600 mt-2">{totalBookings}</p>
            </div>
            </div>
        </div>
    
        </div>
            <h2>Booking Statistics</h2>
            <div>
                <h3>Bookings Per Show</h3>
                {bookingCountData.labels.length > 0 ? (
                    <Bar data={bookingCountData} />
                ) : (
                    <p>Loading bookings chart...</p>
                )}
            </div>
            <div>
                <h3>Total Days Per Show</h3>
                {totalDaysData.labels.length > 0 ? (
                    <Bar data={totalDaysData} />
                ) : (
                    <p>Loading total days chart...</p>
                )}
            </div>
        </div>
    );
};

export default Stats;
