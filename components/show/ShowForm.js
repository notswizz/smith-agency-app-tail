import React, { useState } from 'react';

const ShowForm = ({ onShowAdded }) => {
    const [show, setShow] = useState({
        season: '',
        type: '',
        location: '',
        startDate: '',
        endDate: '',
        active: true // Boolean 'active' variable set to true
    });

    const handleChange = (e) => {
        // Check if the changed field is 'active' to handle boolean values
        const value = e.target.name === 'active' ? e.target.checked : e.target.value;
        setShow({ ...show, [e.target.name]: value });
    };

    const generateShowId = () => {
        const year = show.startDate ? new Date(show.startDate).getFullYear() : 'YYYY';
        return `${show.location.toUpperCase()}${show.season}${show.type}${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const showId = generateShowId();
        const newShow = { ...show, id: showId };

        const response = await fetch('/api/shows/addShow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newShow),
        });

        if (response.ok) {
            if (onShowAdded) {
                onShowAdded(newShow);
            }
        } else {
            console.error('Failed to add show');
        }

        setShow({ season: '', type: '', location: '', startDate: '', endDate: '', active: true }); // Reset form fields, including active
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow max-h-96 overflow-auto">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="season" className="block text-gray-700 text-sm font-bold mb-2">Season:</label>
                    <select id="season" name="season" value={show.season} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Select Season</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                    <select id="location" name="location" value={show.location} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Select Location</option>
                        <option value="ATL">ATL</option>
                        <option value="NYC">NYC</option>
                        <option value="LA">LA</option>
                        <option value="DAL">DAL</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                    <select id="type" name="type" value={show.type} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Select Type</option>
                        <option value="Gift">Gift</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Bridal">Bridal</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={show.startDate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
                    <input type="date" id="endDate" name="endDate" value={show.endDate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="active" className="block text-gray-700 text-sm font-bold mb-2">Active:</label>
                    <input 
                        type="checkbox" 
                        id="active" 
                        name="active" 
                        checked={show.active} 
                        onChange={handleChange} 
                        className="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Show</button>
            </form>
        </div>
    );
    
};

export default ShowForm;
