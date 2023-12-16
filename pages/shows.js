import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import ShowForm from '../components/show/ShowForm';
import ShowData from '../components/show/ShowData';
import BookingData from '../components/booking/BookingData'; // Imported BookingData

const ShowsPage = () => {
    const [shows, setShows] = useState([]);
    const [bookings, setBookings] = useState([]);

    // Fetch Shows
    const fetchShows = async () => {
        const response = await fetch('/api/shows/getShows');
        if (response.ok) {
            const data = await response.json();
            setShows(data);
        }
    };

    // Fetch Bookings
    const fetchBookings = async () => {
        const response = await fetch('/api/bookings/getBookings'); // Adjust the endpoint as necessary
        if (response.ok) {
            const data = await response.json();
            setBookings(data);
        }
    };

    useEffect(() => {
        fetchShows();
        fetchBookings();
    }, []);

    const handleShowAdded = async () => {
        await fetchShows(); // Refresh the list after adding a show
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

    const handlePrintShowBookings = (showId) => {
        // Filter bookings that have the same show ID
        const filteredBookings = bookings.filter(booking => booking.show === showId);
    
        // Check if there are any bookings found and print their clients
        if (filteredBookings.length > 0) {
            console.log(`Clients for show ${showId}:`, filteredBookings.map(booking => booking.client));
        } else {
            console.log(`No bookings found for show ${showId}`);
        }
    };

    // Log for debugging
    console.log("Bookings data: ", bookings);

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <div className="flex flex-row justify-between">
                    <div className="flex-1 mr-2">
                        <ShowForm onShowAdded={handleShowAdded} />
                    </div>
                    <div className="flex-1 ml-2">
                        <ShowData
                            shows={shows}
                            bookings={bookings}
                            onDeleteShow={handleDeleteShow}
                            onArchiveShow={handleArchiveShow}
                            handlePrintShowBookings={handlePrintShowBookings}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShowsPage;
