import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link from next/link
import Header from '../components/nav/Header';
import ShowForm from '../components/show/ShowForm';
import ShowData from '../components/show/ShowData';

const AdminPage = () => {
    const [shows, setShows] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false); // State to manage form visibility

    // Fetch Shows
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

    const handleShowAdded = async () => {
        await fetchShows(); // Refresh the list after adding a show
        setIsFormVisible(false); // Hide the form after adding a show
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
        const response = await fetch(`/api/shows/archiveShow?id=${showId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: false })
        });

        if (response.ok) {
            await fetchShows(); // Refresh the list after archiving
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <Header />

            <div className="container mx-auto px-4 mt-6">
                 {/* New Link button to navigate to Agent Forms */}
                 <div>
                 <Link href="/agent-forms" passHref>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
                        Go to Agent Forms
                    </button>
                </Link>
                </div>
                <button 
                    onClick={toggleFormVisibility}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    {isFormVisible ? 'Hide Form' : 'Add New Show'}
                </button>

                {isFormVisible ? (
                    <ShowForm onShowAdded={handleShowAdded} />
                ) : (
                    <ShowData
                        shows={shows}
                        onDeleteShow={handleDeleteShow}
                        onArchiveShow={handleArchiveShow}
                    />
                )}
            </div>
        </>
    );
};

export default AdminPage;
