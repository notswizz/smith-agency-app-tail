import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ShowForm from '../components/ShowForm';
import ShowData from '../components/ShowData';

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

    return (
        <>
            <Header />
            <div className="container">
                <ShowForm onShowAdded={handleShowAdded} />
                <ShowData shows={shows} onDeleteShow={handleDeleteShow} />
            </div>
        </>
    );
};

export default ShowsPage;
