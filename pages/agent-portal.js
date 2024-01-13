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
    const [agent, setAgent] = useState(null);
    const [shows, setShows] = useState([]);
    const [availabilityEvents, setAvailabilityEvents] = useState([]);
    const { data: session } = useSession();
    const [showEvents, setShowEvents] = useState([]);
    const [showCalendarView, setShowCalendarView] = useState(false);
    const [fetchedAgentData, setFetchedAgentData] = useState(false);

    const announcements = [
        "Announcement 1: Important update!",
        "Announcement 2: New features!",
        "Announcement 3: Upcoming events!",
        // Add more announcements here
    ];

    useEffect(() => {
        if (session) {
            Promise.all([fetchAgentData(session.user.email), fetchShowsForCalendar(), fetchShowsForForm()])
                .then(([agentAvailabilityEvents, showEvents]) => {
                    setShowEvents([...agentAvailabilityEvents, ...showEvents]);
                });
        }
    }, [session]);

    const fetchAgentData = async (email) => {
        try {
            const response = await fetch(`/api/agents/getAgentByEmail?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const agentData = await response.json();
                setAgent(agentData);

                const agentAvailabilityEvents = agentData.availability.map(avail => ({
                    title: '✓',
                    start: new Date(avail.date),
                    end: new Date(avail.date),
                    allDay: true,
                    backgroundColor: 'green',
                }));

                setFetchedAgentData(true);
                return agentAvailabilityEvents;
            } else {
                console.error('Failed to fetch agent data');
            }
        } catch (error) {
            console.error('Error fetching agent data:', error);
        }
    };

    const fetchShowsForForm = async () => {
        try {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const fetchedShows = await response.json();
                setShows(fetchedShows); // set the shows state with fetchedShows directly
            } else {
                console.error('Failed to fetch shows');
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
        }
    };

    const fetchShowsForCalendar = async () => {
        try {
            const response = await fetch('/api/shows/getShows');
            if (response.ok) {
                const fetchedShows = await response.json();
                const showEvents = fetchedShows.map(show => ({
                    title: show.type + ' in ' + show.location,
                    start: new Date(show.startDate),
                    end: new Date(show.endDate),
                    allDay: true,
                    resource: show.id,
                }));
                return showEvents;
            } else {
                console.error('Failed to fetch shows');
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
        }
    };

    const handleAvailabilityAdded = () => {
        fetchAgentData(session.user.email);
    };

    const agentNeedsToUpdateProfile = () => {
        return agent && !agent.phone;
    };

    return (
        <>
            <AnnouncementsHeader announcements={announcements} />
            <div className="container mx-auto p-4">
                <div className="flex flex-col items-center">
                    <img src="/tsawhite.png" alt="TSA Logo" className="w-32 mb-4" />

                    {session ? (
                        <>
                            {agentNeedsToUpdateProfile() ? (
                                <AgentFormAgent />
                            ) : (
                                <>
                                    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 w-full md:w-3/4 lg:w-1/2 flex items-center justify-center">
                                        {agent && (
                                            <h2 className="text-4xl font-bold text-gray-800 mb-2">{agent.name}</h2>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setShowCalendarView(!showCalendarView)}
                                        className={`my-4 px-4 py-2 rounded transition-colors duration-300 ${showCalendarView ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-300 hover:bg-gray-500 text-gray-800'}`}
                                    >
                                        {showCalendarView ? 'Show Form' : 'Show Calendar'}
                                    </button>

                                    {showCalendarView ? (
                                        <Calendar
                                            localizer={localizer}
                                            events={showEvents}
                                            startAccessor="start"
                                            endAccessor="end"
                                            style={{ height: 600, width: '100%' }}
                                            eventPropGetter={(event) => ({
                                                style: { 
                                                    backgroundColor: event.backgroundColor || '#3174ad',
                                                    color: 'white',
                                                    borderRadius: '0px',
                                                    border: 'none'
                                                }
                                            })}
                                            className="rounded shadow-lg"
                                        />
                                    ) : (
                                        <AvailabilityForm
                                        shows={shows}
                                        onAvailabilityAdded={handleAvailabilityAdded}
                                    />
                                    
                                    )}

                                    <button
                                        onClick={() => signOut()}
                                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center mt-4">
                            <h2 className="text-xl font-semibold mb-3">Agent Portal</h2>
                            <button
                                onClick={() => signIn()}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Sign in
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AgentPortal;

