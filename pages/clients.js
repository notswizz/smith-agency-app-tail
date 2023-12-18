import React, { useState, useEffect } from 'react';
import Header from '../components/nav/Header';
import ClientForm from '../components/client/ClientForm';
import ClientData from '../components/client/ClientData';
import ClientFilter from '../components/client/ClientFilter';

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredClientCount, setFilteredClientCount] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            const response = await fetch('/api/clients/getClients');
            if (response.ok) {
                const data = await response.json();
                setClients(data);
                setFilteredClients(data);
                setFilteredClientCount(data.length); // Initialize with the total number of clients
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
            fetchClients(); // Refresh the clients list
        } else {
            console.error('Failed to add client', await response.json());
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

    const handleFilterChange = (filters) => {
        if (filters.company === '' && filters.contact === '') {
            setFilteredClients(clients);
            setFilteredClientCount(clients.length);
        } else {
            const { company, contact } = filters;
            const filtered = clients.filter(client => {
                const clientCompany = client.company.toLowerCase();
                const clientContact = client.contact.toLowerCase();
    
                const filterCompany = company.toLowerCase();
                const filterContact = contact.toLowerCase();
    
                return (company ? clientCompany.includes(filterCompany) : true) &&
                       (contact ? clientContact.includes(filterContact) : true);
            });
    
            setFilteredClients(filtered);
            setFilteredClientCount(filtered.length);
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-4 md:mr-4">
                        <button 
                            onClick={toggleFormVisibility}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
                        >
                            {isFormVisible ? 'Hide Form' : 'Add New Client'}
                        </button>
                        {!isFormVisible && <ClientFilter 
                            onFilterChange={handleFilterChange}
                            filteredClientCount={filteredClientCount}
                        />}
                    </div>
                    <div className="flex-1">
                        {isFormVisible ? (
                            <ClientForm onClientAdded={handleClientAdded} />
                        ) : (
                            <ClientData clients={filteredClients} onDeleteClient={handleDeleteClient} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientsPage;
