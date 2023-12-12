import React from 'react';

const ShowData = ({ shows, onDeleteShow }) => {
    return (
        <div className="data-container">
            {shows.map(show => (
                <div className="data-item" key={show.id || 'N/A'}>
                    <h3>{show.id}</h3>
                    <p>                      </p>
                    <p>{show.startDate}</p>
                    <p>{show.endDate}</p>
                    <button onClick={() => onDeleteShow(show.id)} className="delete-button">Delete</button>
                </div>
            ))}
        </div>
    );
};

export default ShowData;
