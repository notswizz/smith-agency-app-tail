import React, { useState, useEffect } from 'react';

const BookingForm = ({ onBookingAdded }) => {
    const [booking, setBooking] = useState({
        show: '',
        client: '',
        startDate: '',
        endDate: '',
        agentCounts: [],
    });

    const [clients, setClients] = useState([]);
    const [shows, setShows] = useState([]);
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        // Fetch clients, shows, and agents from API
        const fetchData = async () => {
            const clientsResponse = await fetch('/api/clients/getClients');
            const showsResponse = await fetch('/api/shows/getShows');
            const agentsResponse = await fetch('/api/agents/getAgents');

            if (clientsResponse.ok && showsResponse.ok && agentsResponse.ok) {
                setClients(await clientsResponse.json());
                setShows(await showsResponse.json());
                setAgents(await agentsResponse.json());
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setBooking({ ...booking, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });

        if (name === 'endDate' || (name === 'startDate' && booking.endDate)) {
            const start = new Date(booking.startDate);
            const end = new Date(value);
            const dateRange = generateDateRange(start, end);
            const newAgentCounts = dateRange.map((_, index) => booking.agentCounts[index] || 0);
            setBooking(prev => ({ ...prev, agentCounts: newAgentCounts }));
        }
    };

    const handleAgentCountChange = (index, value) => {
        const updatedAgentCounts = [...booking.agentCounts];
        updatedAgentCounts[index] = Number(value);
        setBooking({ ...booking, agentCounts: updatedAgentCounts });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const dateRange = generateDateRange(start, end);

        // Construct agentSelection array based on agentCounts
        const agentSelection = dateRange.map((_, index) => new Array(booking.agentCounts[index]).fill(''));

        const newBooking = {
            ...booking,
            id: `${booking.client}-${booking.show}`, // Generate a unique ID for the booking
            totalDays: booking.agentCounts.reduce((acc, val) => acc + val, 0),
            agentSelection,
        };

        const response = await fetch('/api/bookings/addBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBooking),
        });

        if (response.ok) {
            const addedBooking = await response.json();
            onBookingAdded(addedBooking);
            setBooking({ show: '', client: '', startDate: '', endDate: '', agentCounts: [] }); // Reset form fields
        } else {
            console.error('Failed to add booking');
        }
    };

    const generateDateRange = (start, end) => {
        let dates = [];
        let currentDate = new Date(start.toISOString().split('T')[0]);
        let endDate = new Date(end.toISOString().split('T')[0]);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white rounded shadow">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="show" className="block text-gray-700 text-sm font-bold mb-2">Show:</label>
                    <select id="show" name="show" value={booking.show} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="" disabled selected>Select a show</option>
                        {shows.map(show => <option key={show.id} value={show.id}>{show.id}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="client" className="block text-gray-700 text-sm font-bold mb-2">Client:</label>
                    <select id="client" name="client" value={booking.client} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="" disabled selected>Select a client</option>
                        {clients.map(client => <option key={client.id} value={client.company}>{client.company}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={booking.startDate} onChange={handleDateChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
                    <input type="date" id="endDate" name="endDate" value={booking.endDate} onChange={handleDateChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                {booking.startDate && booking.endDate && generateDateRange(new Date(booking.startDate), new Date(booking.endDate)).map((date, index) => (
                    <div key={index} className="mb-4">
                        <label htmlFor={`agentCount-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                            {date.toISOString().slice(0, 10)}
                        </label>
                        <input
                            type="number"
                            id={`agentCount-${index}`}
                            name={`agentCount-${index}`}
                            min="0"
                            value={booking.agentCounts[index] || 0}
                            onChange={(e) => handleAgentCountChange(index, e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Booking</button>
            </form>
        </div>
    );
};

export default BookingForm;
