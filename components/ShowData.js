import React from 'react';

const ShowData = ({ shows, onDeleteShow, onArchiveShow }) => {
    return (
        <div className="data-container">
            {shows.map(show => (
                <div className="data-item" key={show._id || 'N/A'}>
                    <h3>{show.id}</h3> {/* Display show ID */}
                    <p>Start Date: {show.startDate}</p>
                    <p>End Date: {show.endDate}</p>
                    <p>Status: {show.active ? 'Active' : 'Archived'}</p>
                    <button onClick={() => onDeleteShow(show._id)} className="delete-button">Delete</button>
                    {show.active && (
                        <button onClick={() => onArchiveShow(show._id)} className="archive-button">Archive</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ShowData;
