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
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="company">Company:</label>
                    <input type="text" id="company" name="company" value={client.company} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="website">Website:</label>
                    <input type="text" id="website" name="website" value={client.website} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="contact">Contact Name:</label>
                    <input type="text" id="contact" name="contact" value={client.contact} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={client.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="boothLocation">Booth Location (BLD-FL-#):</label>
                    <input type="text" id="boothLocation" name="boothLocation" value={client.boothLocation} onChange={handleChange} />
                </div>
                {/* Include other fields as necessary */}
                <button type="submit" className="button">Add Client</button>
            </form>
        </div>
    );
};

export default ClientForm;
