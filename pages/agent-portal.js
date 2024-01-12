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
            <div className="agent-portal-container">
                {session ? (
                    <>
                        <div className="text-center mb-4">
                            Signed in as <strong>{session.user.email}</strong>
                            <button onClick={() => signOut()} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Sign out
                            </button>
                        </div>
                        <div className="flex justify-center gap-4 mb-4">
                            <button onClick={() => setActiveComponent('calendar')} className="font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white">
                                Calendar
                            </button>
                            <button onClick={() => setActiveComponent('availabilityForm')} className="font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-700 text-white">
                                Availability Form
                            </button>
                            <button onClick={() => setActiveComponent('newAgentForm')} className="font-bold py-2 px-4 rounded bg-yellow-500 hover:bg-yellow-700 text-white">
                                New Agent Form
                            </button>
                        </div>
                        {activeComponent === 'calendar' && (
                            <Calendar
                                localizer={localizer}
                                events={showEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 400, minHeight: '400px' }}
                            />
                        )}
                        {activeComponent === 'availabilityForm' && (
                            <AvailabilityForm agents={agents} shows={shows} />
                        )}
                        {activeComponent === 'newAgentForm' && (
                            <AgentFormAgent />
                        )}
                       
                    </>
                ) : (
                    <div className="sign-in-container">
                        <img src="/tsawhite.png" alt="TSA Logo" className="tsa-logo" />
                        <h2 className="welcome-message">Agent Portal</h2>
                        <button onClick={() => signIn()} className="sign-in-button">
                            Sign in
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default AgentPortal;