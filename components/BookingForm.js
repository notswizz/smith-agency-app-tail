import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../lib/storage';

const BookingForm = ({ onBookingAdded }) => {
    const [booking, setBooking] = useState({
        show: '',
        client: '',
        startDate: '',
        endDate: '',
        agentCounts: [],
    });

    // Load clients, shows, and agents data
    const [clients, setClients] = useState([]);
    const [shows, setShows] = useState([]);
    const [agents, setAgents] = useState(loadData('agents') || []); // Load agents

    useEffect(() => {
        const loadedClients = loadData('clients') || [];
        const loadedShows = loadData('shows') || [];
        setClients(loadedClients);
        setShows(loadedShows);
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

    const handleSubmit = (e) => {
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

        onBookingAdded(newBooking); // Call the function passed from the parent to handle the booking addition

        setBooking({ show: '', client: '', startDate: '', endDate: '', agentCounts: [] }); // Reset booking
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
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="show">Show:</label>
                    <select id="show" name="show" value={booking.show} onChange={handleChange}>
                        <option value="" disabled selected>Select a show</option>
                        {shows.map(show => <option key={show.id} value={show.id}>{show.id}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="client">Client:</label>
                    <select id="client" name="client" value={booking.client} onChange={handleChange}>
                        <option value="" disabled selected>Select a client</option>
                        {clients.map(client => <option key={client.id} value={client.company}>{client.company}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={booking.startDate} onChange={handleDateChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" id="endDate" name="endDate" value={booking.endDate} onChange={handleDateChange} />
                </div>
                {booking.startDate && booking.endDate && generateDateRange(new Date(booking.startDate), new Date(booking.endDate)).map((date, index) => (
                    <div key={index} className="form-group">
                        <label htmlFor={`agentCount-${index}`}>
                            {date.toISOString().slice(0, 10)}: Number of Agents
                        </label>
                        <input
                            type="number"
                            id={`agentCount-${index}`}
                            name={`agentCount-${index}`}
                            min="0"
                            value={booking.agentCounts[index] || 0}
                            onChange={(e) => handleAgentCountChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit" className="button">Add Booking</button>
            </form>
        </div>
    );
};

export default BookingForm;
