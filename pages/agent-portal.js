import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AvailabilityForm from '../components/portal/AvailabilityForm';
import AnnouncementsHeader from '../components/home/AnnouncementsHeader';
import { signOut, useSession } from "next-auth/react";
import AgentFormAgent from '../components/portal/FormAgent';
import MyCalendarComponent from '../components/portal/AvailabilityCalendar';

const AgentPortal = () => {
    const [shows, setShows] = useState([]);
    const [agentData, setAgentData] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();
    const [showCalendar, setShowCalendar] = useState(false);


    const announcements = [
        "Earn $$ for submitting phone #s of potential TSA Sales Reps",
        "Fill out your Availability Form before the show",
        "ATL Gift - Event 1/28 @ Ponce City Market",
        // Add more announcements here
    ];

    useEffect(() => {
        if (!session) {
            router.push('/'); // Redirect to index.js if not logged in
        } else {
            fetchAgentData(session.user.email);
            fetchShowsForForm().then(fetchedShows => {
                setShows(fetchedShows);
            });
        }
    }, [session, router]);
    

    const fetchAgentData = async (email) => {
        try {
            const response = await fetch(`/api/agents/getAgentByEmail?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                setAgentData(data);
            } else {
                console.error('Failed to fetch agent data');
            }
        } catch (error) {
            console.error('Error fetching agent data', error);
        }
    };

    const fetchShowsForForm = async () => {
        const response = await fetch('/api/shows/getShows');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch shows');
            return [];
        }
    };

    const navigateToAdmin = () => {
        if (agentData && agentData.admin === "true") {
            router.push('/admin');
        } else {
            alert('You are not authorized to access the admin page.');
        }
    };


    const handleLogout = () => {
        signOut();
    };
    const toggleView = () => {
        setShowCalendar(!showCalendar);
    };

    return (
        <>
            <AnnouncementsHeader announcements={announcements} />
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <h1 className="text-4xl font-bold mt-6 text-center" style={{ color: '#344868' }}>
                    THE SMITH AGENCY
                </h1>
                <p className="text-center text-lg mb-8 italic" style={{ color: '#A1BFE4' }}>
                    PREMIER STAFFING
                </p>
                <div className="w-full max-w-xs mx-auto p-4 rounded-lg shadow-lg flex flex-col items-center justify-center" style={{ backgroundColor: '#344868' }}>
                    <img 
                        src={session?.user?.image || "/tsalogo.png"} 
                        alt="User Profile" 
                        className="w-32 h-32 md:w-32 md:h-32 border-white shadow-lg mb-4 rounded-full" 
                    />
                    {session && (
                        <div 
                            className="p-4 rounded-xl shadow-2xl w-full text-center mb-6 transform transition duration-500 hover:scale-105 bg-white"
                        >
                            <h2 
                                className="text-2xl md:text-3xl font-bold mb-1 tracking-wide"
                                style={{ color: '#344868' }}
                            >
                                {session.user.name}
                            </h2>
                            <p 
                                className="text-xs md:text-sm font-medium"
                                style={{ color: '#A1BFE4' }}
                            >
                                {session.user.email}
                            </p>
                            <div 
                                className="mt-3 inline-block text-xs md:text-sm rounded-full px-3 py-1"
                                style={{ backgroundColor: '#F9C0C2', color: '#344868' }}
                            >
                                TSA Sales Rep
                            </div>
                        </div>
                    )}
                    {session && agentData && agentData.admin === "true" && (
                        <button
                            onClick={navigateToAdmin}
                            className="w-full py-1 rounded hover:bg-gray-200 transition-colors duration-300 shadow-md mt-4"
                            style={{ color: '#344868', backgroundColor: '#6db65b' }}
                        >
                            Admin Portal
                        </button>
                    )}
                    {session && (
                        <button
                            onClick={handleLogout}
                            className="w-full py-1 rounded hover:bg-gray-200 transition-colors duration-300 shadow-md mt-4"
                            style={{ color: '#344868', backgroundColor: '#A1BFE4' }}
                        >
                            Logout
                        </button>
                    )}
                </div>
   
                {session && (
                    <div className="w-full max-w-md md:max-w-3xl bg-white p-6 rounded-lg shadow-lg mt-4">
                        {agentData && agentData.phone ? (
                            <div>
                                <button 
                                    onClick={toggleView} 
                                    className="w-full mb-4 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                                >
                                    {showCalendar ? 'Show Availability Form' : 'Show Calendar'}
                                </button>

                                {showCalendar ? (
                                    <div className="w-full overflow-hidden">
                                        <MyCalendarComponent email={session?.user?.email} />
                                    </div>
                                ) : (
                                    <AvailabilityForm shows={shows} />
                                )}
                            </div>
                        ) : (
                            <AgentFormAgent />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AgentPortal;
