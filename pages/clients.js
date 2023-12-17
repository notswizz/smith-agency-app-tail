import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import ClientForm from '../components/client/ClientForm';
import ClientData from '../components/client/ClientData';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false); // State to manage form visibility

    useEffect(() => {
        const fetchClients = async () => {
            const response = await fetch('/api/clients/getClients');
            if (response.ok) {
                const data = await response.json();
                setClients(data);
            }
        };
        fetchClients();
    }, []);

    const handleClientAdded = async (newClient) => {
        const response = await fetch('/api/clients/addClient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newClient),
        });

        if (response.ok) {
            const addedClient = await response.json();
            setClients([...clients, addedClient]);
        }
    };

    const handleDeleteClient = async (clientId) => {
        const response = await fetch(`/api/clients/deleteClient?id=${clientId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setClients(clients.filter(client => client._id !== clientId));
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <button 
                    onClick={toggleFormVisibility}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    {isFormVisible ? 'Hide Form' : 'Add New Client'}
                </button>

                {isFormVisible ? (
                    <ClientForm onClientAdded={handleClientAdded} />
                ) : (
                    <ClientData clients={clients} onDeleteClient={handleDeleteClient} />
                )}
            </div>
        </>
    );
};

export default ClientsPage;
