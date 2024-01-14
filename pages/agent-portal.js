import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AvailabilityForm from '../components/form/AvailabilityForm';
import AnnouncementsHeader from '../components/home/AnnouncementsHeader';
import { signOut, useSession } from "next-auth/react";
import AgentFormAgent from '../components/form/FormAgent';

const AgentPortal = () => {
    const [shows, setShows] = useState([]);
    const [agentData, setAgentData] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();


    const announcements = [
        "Announcement 1: Important update!",
        "Announcement 2: New features!",
        "Announcement 3: Upcoming events!",
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

    return (
        <>
            <AnnouncementsHeader announcements={announcements} />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
                <h1 className="text-3xl font-bold text-gray-800 mt-6">
                    THE SMITH AGENCY
                </h1>
                <p className="text-center text-lg text-gray-600 mb-8">
                    PREMIER STAFFING
                </p>
                <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
                    <img src="/tsalogo.png" alt="TSA Logo" className="w-32 h-32 mx-auto rounded-full" />
                </div>
                {session && agentData && agentData.admin === "true" && (
                <div className="mt-4">
                 <button
    onClick={navigateToAdmin}
    className="button-custom admin-btn"
>
    Admin Portal
</button>

                </div>
            )}
                {session && (
                    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mt-4">
                        {agentData && agentData.phone
                            ? <AvailabilityForm shows={shows} />
                            : <AgentFormAgent />
                        }
                    </div>
                )}
    
                {session && (
                    <div className="w-full max-w-3xl mt-4 bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                        <span className="text-lg text-gray-800 font-semibold">
                            {session.user.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="py-1 px-3 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors duration-300"
                        >
                            Logout
                        </button>
                    </div>
                )}



            </div>
        </>
    );
      
    
    
};

export default AgentPortal;
