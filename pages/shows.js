import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import ShowForm from '../components/show/ShowForm';
import ShowData from '../components/show/ShowData';

const ShowsPage = () => {
    const [shows, setShows] = useState([]);

    // Define fetchShows outside of useEffect
    const fetchShows = async () => {
        const response = await fetch('/api/shows/getShows');
        if (response.ok) {
            const data = await response.json();
            setShows(data);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    const handleShowAdded = async (newShow) => {
        await fetchShows(); // This now should work
    };

    const handleDeleteShow = async (showId) => {
        const response = await fetch(`/api/shows/deleteShow?id=${showId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await fetchShows(); // Refresh the list after deletion
        }
    };

    const handleArchiveShow = async (showId) => {
        // Assuming your API has an endpoint for updating the show's 'active' status
        const response = await fetch(`/api/shows/archiveShow?id=${showId}`, {
            method: 'PATCH', // or 'PUT', depending on your API
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: false })
        });

        if (response.ok) {
            await fetchShows(); // Refresh the list after archiving
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <div className="flex flex-row justify-between">
                    <div className="flex-1 mr-2">
                        <ShowForm onShowAdded={handleShowAdded} />
                    </div>
                    <div className="flex-1 ml-2">
                        <ShowData shows={shows} onDeleteShow={handleDeleteShow} onArchiveShow={handleArchiveShow} />
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default ShowsPage;