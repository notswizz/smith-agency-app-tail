import React, { useState } from 'react';
import { loadData, saveData } from '../lib/storage';

const ShowForm = ({ onShowAdded }) => {
    const [show, setShow] = useState({
        season: '',
        type: '',
        location: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setShow({ ...show, [e.target.name]: e.target.value });
    };

    const generateShowId = () => {
        const year = show.startDate ? new Date(show.startDate).getFullYear() : 'YYYY';
        return `${show.location.toUpperCase()}${show.season}${show.type}${year}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const shows = loadData('shows');
        const showId = generateShowId();
        const newShow = { ...show, id: showId };
        saveData('shows', [...shows, newShow]);
        if (onShowAdded) {
            onShowAdded(newShow);
        }
        setShow({ season: '', type: '', location: '', startDate: '', endDate: '' });
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="season">Season:</label>
                    <select id="season" name="season" value={show.season} onChange={handleChange}>
                        <option value="">Select Season</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <select id="location" name="location" value={show.location} onChange={handleChange}>
                        <option value="">Select Location</option>
                        <option value="ATL">ATL</option>
                        <option value="NYC">NYC</option>
                        <option value="LA">LA</option>
                        <option value="DAL">DAL</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type:</label>
                    <select id="type" name="type" value={show.type} onChange={handleChange}>
                        <option value="">Select Type</option>
                        <option value="Gift">Gift</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Bridal">Bridal</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={show.startDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" id="endDate" name="endDate" value={show.endDate} onChange={handleChange} />
                </div>
                <button type="submit" className="button">Add Show</button>
            </form>
        </div>
    );
};

export default ShowForm;
