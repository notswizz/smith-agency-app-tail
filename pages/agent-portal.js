import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AvailabilityForm from '../components/form/AvailabilityForm';
import AgentFormAgent from '../components/form/FormAgent';
import AnnouncementsHeader from '../components/AnnouncementsHeader';

import { signIn, signOut, useSession } from "next-auth/react";

const localizer = momentLocalizer(moment);

const AgentPortal = () => {
    const [agents, setAgents] = useState([]);
    const [shows, setShows] = useState([]);
    const [activeComponent, setActiveComponent] = useState('calendar');
    const { data: session, status } = useSession();
    const [showEvents, setShowEvents] = useState([]);
   

    const announcements = [
        "Announcement 1: Important update!",
        "Announcement 2: New features!",
        "Announcement 3: Upcoming events!",
        // Add more announcements here
    ];

    useEffect(() => {
        if (session) {
            fetchAgents();
            fetchShows();
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchShows().then(shows => {
                const events = shows.map(show => ({
                    title: show.type + ' at ' + show.location,
                    start: new Date(show.startDate),
                    end: new Date(show.endDate),
                    allDay: true
                }));
                setShowEvents(events);
            });
            fetchAgents();
        }
    }, [session]);

    const fetchAgents = async () => {
        try {
            const response = await fetch('/api/agents/getAgents');
            if (response.ok) {
                const data = await response.json();
                setAgents(data);
            } else {
                console.error('Failed to fetch agents');
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const fetchShows = async () => {
        try {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const data = await response.json();
                return data;  // Ensure data is returned
            } else {
                console.error('Failed to fetch shows');
                return [];  // Return an empty array in case of failure
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
            return [];  // Return an empty array in case of exception
        }
    };

    const events = shows.map(show => ({
        title: show.type + ' at ' + show.location,
        start: new Date(show.startDate),
        end: new Date(show.endDate),
        allDay: true,
        style: {
            backgroundColor: locationToColor[show.location] || "#ddd",
        },
    }));

    
    
    const toggleForm = () => {
        setIsAgentFormActive(!isAgentFormActive);
    };

return (
    <>
        <AnnouncementsHeader announcements={announcements} />
        <div className="flex flex-col items-center p-4">
            <img src="/tsawhite.png" alt="TSA Logo" className="w-32 mb-4" />

            {session ? (
                <>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 mb-5">
                        <button onClick={() => setActiveComponent('calendar')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-pink-500 border w-full sm:w-auto">
                            Calendar
                        </button>
                        <button onClick={() => setActiveComponent('availabilityForm')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded border-pink-500 border w-full sm:w-auto">
                            Availability Form
                        </button>
                        <button onClick={() => setActiveComponent('newAgentForm')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded border-pink-500 border w-full sm:w-auto">
                            New Agent Form
                        </button>
                    </div>

                    {activeComponent === 'calendar' && (
                        <Calendar
                            localizer={localizer}
                            events={showEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                        />
                    )}
                    {activeComponent === 'availabilityForm' && <AvailabilityForm agents={agents} shows={shows} />}
                    {activeComponent === 'newAgentForm' && <AgentFormAgent />}

                    <div className="text-center mt-5">
                        <p className="text-gray-600 text-sm">Signed in as <strong>{session.user.email}</strong></p>
                        <button onClick={() => signOut()} className="text-red-500 hover:text-red-700 text-xs font-bold">
                            Sign out
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-3">Agent Portal</h2>
                    <button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
                        Sign in
                    </button>
                </div>
            )}
        </div>
    </>
);

    
};

export default AgentPortal;