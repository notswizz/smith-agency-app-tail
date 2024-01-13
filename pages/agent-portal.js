import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AvailabilityForm from '../components/form/AvailabilityForm';
import AnnouncementsHeader from '../components/home/AnnouncementsHeader';
import { signOut, useSession } from "next-auth/react";

const AgentPortal = () => {
    const [shows, setShows] = useState([]);
    const { data: session } = useSession();

    const announcements = [
        "Announcement 1: Important update!",
        "Announcement 2: New features!",
        "Announcement 3: Upcoming events!",
        // Add more announcements here
    ];

    useEffect(() => {
        if (session) {
            fetchShowsForForm().then(fetchedShows => {
                setShows(fetchedShows);
            });
        }
    }, [session]);

    const fetchShowsForForm = async () => {
        const response = await fetch('/api/shows/getShows');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch shows');
            return [];
        }
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <>
            <AnnouncementsHeader announcements={announcements} />
            <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center px-4">
                <div className="flex justify-between items-center w-full max-w-2xl">
                    <img src="/tsalogo.png" alt="TSA Logo" className="w-32 mx-auto block rounded-full shadow-lg" />
                    {session && (
                        <div className="text-sm text-gray-600">
                            <span>{session.user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="ml-4 text-blue-500 hover:text-blue-700 transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <h1 className="text-2xl font-semibold text-gray-700 my-4">
                    THE SMITH AGENCY
                </h1>
                <p className="text-center text-sm text-gray-600 mb-8">
                    PREMIER STAFFING
                </p>
                {session && (
                    <AvailabilityForm
                        shows={shows}
                    />
                )}
            </div>
        </>
    );
};

export default AgentPortal;
