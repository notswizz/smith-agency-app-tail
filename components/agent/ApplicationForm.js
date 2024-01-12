import React, { useState } from 'react';

const ApplicationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        resume: null,
        salesExperience: '',
        college: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await fetch('/api/agents/addApplication', {
                method: 'POST',
                body: data, // FormData will be correctly interpreted by the server
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Application submitted successfully', result);
                // Handle success (e.g., showing a success message, clearing the form)
            } else {
                console.error('Submission failed', await response.text());
                // Handle errors (e.g., showing an error message)
            }
        } catch (error) {
            console.error('Error submitting the form', error);
            // Handle network errors (e.g., showing an error message)
        }
    };
    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-md rounded-lg">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Join Our Team</h2>
        <p className="text-center text-gray-600 mb-8">The 1st step to working for The Smith Agency!</p>
    
        {/* Name Field */}
        <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    
        {/* Resume Upload */}
        <div className="mb-6">
            <label htmlFor="resume" className="block text-gray-700 text-sm font-bold mb-2">Resume:</label>
            <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    
        {/* Sales Experience Field */}
        <div className="mb-6">
            <label htmlFor="salesExperience" className="block text-gray-700 text-sm font-bold mb-2">Sales Experience:</label>
            <input
                type="text"
                id="salesExperience"
                name="salesExperience"
                value={formData.salesExperience}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    
        {/* College Field */}
        <div className="mb-8">
            <label htmlFor="college" className="block text-gray-700 text-sm font-bold mb-2">College:</label>
            <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    
        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Submit Application
        </button>
    </form>
    
    );
    
};

export default ApplicationForm;
