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
    const [isAgentFormActive, setIsAgentFormActive] = useState(false);
    const { data: session, status } = useSession();
    const loading = status === "loading";
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
    
    const toggleForm = () => {
        setIsAgentFormActive(!isAgentFormActive);
    };

    return (
        <>
          <AnnouncementsHeader announcements={announcements} />
           
            <div className="container mx-auto px-4 py-4 bg-gray-100">
                {session ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Calendar
                                localizer={localizer}
                                events={showEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 300, minHeight: '300px' }}
                            />
                        </div>
                        <div>
                            <div className="text-center mb-4">
                                Signed in as <strong>{session.user.email}</strong>
                                <button onClick={() => signOut()} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Sign out
                                </button>
                            </div>
                            <div className="flex justify-center gap-4 mb-4">
                                <button 
                                    onClick={toggleForm} 
                                    className={`font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${isAgentFormActive ? 'bg-gray-300 text-gray-700' : 'bg-pink-500 hover:bg-pink-700 text-white'}`}>
                                    Availability Form
                                </button>
                                <button 
                                    onClick={toggleForm} 
                                    className={`font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${isAgentFormActive ? 'bg-pink-500 hover:bg-pink-700 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                    New Salesperson Form
                                </button>
                            </div>
                            {isAgentFormActive ? (
                                <div className="p-6 rounded-lg shadow-lg bg-white">
                                    <h2 className="text-center text-pink-600 text-xl font-bold mb-4">New Agent Form</h2>
                                    <AgentFormAgent />
                                </div>
                            ) : (
                                <div className="p-6 rounded-lg shadow-lg bg-white">
                                    <h2 className="text-center text-pink-600 text-xl font-bold mb-4">Availability Form</h2>
                                    <AvailabilityForm 
                                        agents={agents} 
                                        shows={shows} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Sign in
                        </button>
                    </div>
                )}
            </div>
        </>
    );
    
};

export default AgentPortal;
