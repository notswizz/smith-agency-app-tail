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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold text-gray-800 mt-6 text-center">
                THE SMITH AGENCY
            </h1>
            <p className="text-center text-lg text-gray-600 mb-8">
                PREMIER STAFFING
            </p>
            <div className="w-full max-w-md md:max-w-4xl p-4 bg-white rounded-lg shadow-md">
                <img src="/tsalogo.png" alt="TSA Logo" className="w-32 h-32 mx-auto rounded-full" />
            </div>
    
            {session && (
                <div className="w-full max-w-md md:max-w-3xl bg-white p-6 rounded-lg shadow-lg mt-4">
                    {agentData && agentData.phone ? (
                        <div>
                            <button onClick={toggleView} className="w-full mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
{session && agentData && agentData.admin === "true" && (
<button
             onClick={navigateToAdmin}
             className="button-custom admin-btn mt-4"
         >
Admin Portal
</button>
)}
{session && (
<div className="w-full max-w-md md:max-w-3xl mt-4 bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
<span className="text-lg text-gray-800 font-semibold mb-4 md:mb-0">
{session.user.email}
</span>
<button
                 onClick={handleLogout}
                 className="py-2 px-4 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors duration-300"
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
