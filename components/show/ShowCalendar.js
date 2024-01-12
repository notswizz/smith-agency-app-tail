import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyCalendarComponent = () => {
    const [shows, setShows] = useState([]);
    const localizer = momentLocalizer(moment);

    const locationToColor = {
        "ATL": "#f00",    // Red for Atlanta shows
        "NYC": "#0f0",    // Green for New York shows
        "LA": "#00f",     // Blue for Los Angeles shows
        // Add more locations and colors as needed
    };

    useEffect(() => {
        const fetchShows = async () => {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const data = await response.json();
                const formattedShows = data.map(show => ({
                    ...show,
                    start: new Date(show.startDate),
                    end: new Date(show.endDate),
                    title: `${show.type} at ${show.location}`,
                    style: {
                        backgroundColor: locationToColor[show.location] || "#ddd", // Default color if location is not found
                    },
                }));
                setShows(formattedShows);
                console.log(formattedShows); // Properly closed console.log statement
            } else {
                console.error('Failed to fetch shows');
            }
        };

        fetchShows();
    }, []);

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={shows}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 1200 }}
                eventPropGetter={(event) => ({
                    style: event.style,
                })}
            />
        </div>
    );
};

export default MyCalendarComponent;
