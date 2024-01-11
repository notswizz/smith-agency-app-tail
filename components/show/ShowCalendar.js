import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyCalendarComponent = () => {
    const [shows, setShows] = useState([]);
    const localizer = momentLocalizer(moment);

    useEffect(() => {
        const fetchShows = async () => {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const data = await response.json();
                const formattedShows = data.map(show => ({
                    ...show,
                    start: new Date(show.startDate),
                    end: new Date(show.endDate),
                    title: `${show.type} at ${show.location}`
                }));
                setShows(formattedShows);
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
                style={{ height: 500 }}
            />
        </div>
    );
};

export default MyCalendarComponent;
