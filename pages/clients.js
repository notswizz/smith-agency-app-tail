import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import ClientForm from '../components/client/ClientForm';
import ClientData from '../components/client/ClientData';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const response = await fetch('/api/clients/getClients'); // Make sure you have this GET API
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

    return (
        <>
            <Header />
            <div className="container">
                <ClientForm onClientAdded={handleClientAdded} />
                <ClientData clients={clients} onDeleteClient={handleDeleteClient} />
            </div>
        </>
    );
};

export default ClientsPage;
