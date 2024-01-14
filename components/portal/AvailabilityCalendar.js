import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyCalendarComponent = ({ email }) => { // Make sure to receive the email prop here
    const [shows, setShows] = useState([]);
    const localizer = momentLocalizer(moment);
    const [agentAvailability, setAgentAvailability] = useState([]);

    const locationToColor = {
        "ATL": "#E53E3E", // Red for Atlanta shows
        "NYC": "#38A169", // Green for New York shows
        "LA": "#3182CE",  // Blue for Los Angeles shows
        "DAL": "#9F7AEA", // Purple for Dallas shows
    }

    // Fetch agent availability
    useEffect(() => {
        async function fetchAgentAvailability() {
            if (email) { // Make sure the email is not null or undefined
                const response = await fetch(`/api/agents/getAgentByEmail?email=${email}`);
                if (response.ok) {
                    const agent = await response.json();
                    const availabilityEvents = agent.availability.map(availability => ({
                        title: availability.status === 'booked' ? 'Booked' : 'Available',
                        start: new Date(availability.date),
                        end: new Date(availability.date),
                        allDay: true,
                        status: availability.status
                    }));
                    setAgentAvailability(availabilityEvents);
                } else {
                    console.error('Failed to fetch agent availability');
                }
            }
        }

        fetchAgentAvailability();
    }, [email]); // Dependency array ensures this effect runs when email changes

    // Fetch shows
    useEffect
(() => {
        const fetchShows = async () => {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const data = await response.json();
                const formattedShows = data.map(show => ({
                    ...show,
                    start: new Date(show.startDate),
                    end: new Date(show.endDate),
                    title: `${show.location} ${show.type}`,
                   
                }));
                setShows(formattedShows);
                console.log(formattedShows); // Properly closed console.log statement
            } else {
                console.error('Failed to fetch shows');
            }
        };

        fetchShows();
    }, []);

    // Combine shows with the agent's availability
useEffect(() => {
    const combinedEvents = [...shows, ...agentAvailability];
    setShows(combinedEvents);
}, [agentAvailability]);


    return (
        <div>
            <Calendar
                localizer={localizer}
                events={shows}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600, backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} // Adjust the style here
                eventPropGetter={(event) => {
                    let backgroundColor = '#ddd'; // Default color
                    if (event.status) {
                        // It's an availability event
                        backgroundColor = event.status === 'booked' ? '#36454F' : '#38A169'; // Dark grey for booked, green for available
                    } else {
                        // It's a show event
                        backgroundColor = locationToColor[event.location] || "#ddd";
                    }
                
                    console.log(`Event: ${event.title}, Color: ${backgroundColor}`);
                    
                    return {
                        style: {
                            backgroundColor: backgroundColor,
                            color: 'white',
                            borderRadius: "0px",
                            border: "none"
                        }
                    };
                }}
                
                
                toolbar={false}
            />
        </div>
    );
};

export default MyCalendarComponent;
