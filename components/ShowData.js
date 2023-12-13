import React from 'react';

const ShowData = ({ shows, onDeleteShow }) => {
    return (
        <div className="data-container">
            {shows.map(show => (
                <div className="data-item" key={show._id || 'N/A'}>
                    <h3>{show.id}</h3> {/* You might want to display a different field here */}
                    <p>{show.startDate}</p>
                    <p>{show.endDate}</p>
                    <button onClick={() => onDeleteShow(show._id)} className="delete-button">Delete</button>
                </div>
            ))}
        </div>
    );
};

export default ShowData;
