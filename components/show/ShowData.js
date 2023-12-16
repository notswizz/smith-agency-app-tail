import React from 'react';
import MasterSheet from '../../templates/masterSheet';


const ShowData = ({ shows, onDeleteShow, onArchiveShow, handlePrintShowBookings, bookings }) => {

    const printMasterSheet = (showId) => {
        const filteredBookings = bookings.filter(booking => booking.show === showId);
        const masterSheetContent = <MasterSheet bookings={filteredBookings} />;

        // Implement the logic to render and print masterSheetContent here
        // This could involve rendering it to a hidden div and using window.print()
        // or another method depending on your specific needs
    };

    return (
        <div className="container mx-auto p-4 max-h-96 overflow-auto">
            {shows.map(show => (
                <div className="bg-white p-4 mb-4 rounded shadow" key={show._id || 'N/A'}>
                    <h3 className="text-lg font-bold mb-2">{show.id}</h3>
                    <p className="mb-1">Start: {show.startDate}</p>
                    <p className="mb-1">End: {show.endDate}</p>
                    <p className="mb-3">{show.active ? 'Active' : 'Archived'}</p>
                    <button onClick={() => onDeleteShow(show._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">Delete</button>
                    {show.active && (
                        <button onClick={() => onArchiveShow(show._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">Archive</button>
                    )}
                    <button onClick={() => printMasterSheet(show.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print</button>
                </div>
            ))}
        </div>
    );
};

export default ShowData;
