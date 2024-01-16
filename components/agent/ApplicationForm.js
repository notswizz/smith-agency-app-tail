import React, { useState } from 'react';
import Image from 'next/image';

// Define your GIFs
const gifs = [
    '/gif/burn.gif',
    '/gif/cat-jam.gif',
    '/gif/deal-with-it.gif',
    '/gif/jammies.gif',
    '/gif/nyan-cat.gif',
    '/gif/party.gif',
    '/gif/zoom-close.gif'
];

const ApplicationForm = () => {
    const initialFormData = {
        name: '',
        phoneNumber: '', // Added phone number field
        referral: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formStatus, setFormStatus] = useState(null);
    const [loadingGif, setLoadingGif] = useState(null);
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Set loadingGif to a random GIF from the defined GIFs
        setLoadingGif(gifs[Math.floor(Math.random() * gifs.length)]);
    
        try {
            const response = await fetch('/api/agents/addApplication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Application submitted successfully', result);
                setFormStatus('success');
                setFormData(initialFormData);
            } else {
                console.error('Submission failed', await response.text());
                setFormStatus('error');
            }
        } catch (error) {
            console.error('Error submitting the form', error);
            setFormStatus('error');
        }
    };
    
    
    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-lg mx-auto bg-white p-8 shadow-md rounded-lg space-y-6 border-2 border-pink-500">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Join Our Team</h2>
    
            <div className="flex justify-center mb-8">
                {loadingGif ? (
                    <Image src={loadingGif} alt="Loading..." width={100} height={200} />
                ) : (
                    <Image
                        src="/tsalogo.png"
                        alt="The Smith Agency"
                        width={100}
                        height={100}
                        className="rounded-lg"
                    />
                )}
            </div>
    
            <p className="text-center text-gray-600 mb-8 text-lg font-semibold">The 1st step to working for The Smith Agency!</p>
    
            <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>
    
            <div className="mb-6">
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>
    
            <div className="mb-6">
                <label htmlFor="referral" className="block text-gray-700 text-sm font-bold mb-2">Referral:</label>
                <input
                    type="text"
                    id="referral"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>
    
            {!loadingGif && (
            <button type="submit" className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded border-2 border-pink-500 focus:outline-none focus:shadow-outline w-full transition-colors duration-200">
                Submit Application
            </button>
        )}
            
            {formStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Your application has been submitted successfully.</span>
                </div>
            )}
            
            {formStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> There was an error submitting your application. Please try again.</span>
                </div>
            )}
        </form>
    );  
};

export default ApplicationForm;