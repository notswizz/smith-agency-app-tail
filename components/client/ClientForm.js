import React, { useState } from 'react';

const ClientForm = ({ onClientAdded }) => {
    const [client, setClient] = useState({
        company: '',
        website: '',
        contact: '',
        email: '',
        boothLocation: '',
    });

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onClientAdded(client);
        setClient({ company: '', website: '', contact: '', email: '', boothLocation: '' });
    };

        return (
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow max-h-96 overflow-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">Company:</label>
                        <input type="text" id="company" name="company" value={client.company} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">Website:</label>
                        <input type="text" id="website" name="website" value={client.website} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">Contact Name:</label>
                        <input type="text" id="contact" name="contact" value={client.contact} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="email" name="email" value={client.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="boothLocation" className="block text-gray-700 text-sm font-bold mb-2">Booth Location (BLD-FL-#):</label>
                        <input type="text" id="boothLocation" name="boothLocation" value={client.boothLocation} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    {/* Include other fields as necessary */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Client</button>
                </form>
            </div>
        );
    };
    
    export default ClientForm;