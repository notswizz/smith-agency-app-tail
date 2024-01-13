import React, { useState } from 'react';
import Image from 'next/image';

const ApplicationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        resume: null,
        referral: '',
        coverLetter: ''
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
               <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Join Our Team</h2>
            {/* TSA Image */}
        <div className="flex justify-center mb-8">
            <Image
                src="/tsalogo.png" // Update the path as needed
                alt="The Smith Agency"
                width={100}  // Adjust the size as needed
                height={100} // Adjust the size as needed
                className="rounded-lg"
            />
        </div>
        {/* Heading */}
     
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
    
      {/* Referral Field */}
      <div className="mb-6">
                <label htmlFor="referral" className="block text-gray-700 text-sm font-bold mb-2">Referral:</label>
                <input
                    type="text"
                    id="referral"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Cover Letter Field */}
            <div className="mb-8">
                <label htmlFor="coverLetter" className="block text-gray-700 text-sm font-bold mb-2">Cover Letter:</label>
                <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                ></textarea>
            </div>
    
        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Submit Application
        </button>
    </form>
    
    );
    
};

export default ApplicationForm;
