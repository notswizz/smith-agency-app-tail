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

    // Define fetchClients function at component level
    const fetchClients = async () => {
        const response = await fetch('/api/clients/getClients');
        if (response.ok) {
            const data = await response.json();
            setClients(data);
            setFilteredClients(data);
            setFilteredClientCount(data.length);
        }
    };

    useEffect(() => {
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
            fetchClients(); // Now fetchClients is accessible here
        } else {
            console.error('Failed to add client', await response.json());
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

    const handleDeleteConfirmation = async (clientId) => {
        if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
            await handleDeleteClient(clientId);
        }
    };

    const handleDeleteClient = async (clientId) => {
        const response = await fetch(`/api/clients/deleteClient?id=${clientId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setClients(clients.filter(client => client._id !== clientId));
            setFilteredClients(filteredClients.filter(client => client._id !== clientId));
            // Update the filtered count as well
            setFilteredClientCount(prevCount => prevCount - 1);
        } else {
            alert('Failed to delete the client. Please try again.');
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 mt-6"> {/* Add margin-top for spacing after the header */}
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                        <button 
                            onClick={toggleFormVisibility}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded w-full mb-4 transition duration-300 ease-in-out" /* Enhanced button styling */
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
                            <div className="p-4 bg-white shadow-md rounded-lg"> {/* Add padding and shadow to form container */}
                                <ClientForm onClientAdded={handleClientAdded} />
                            </div>
                        ) : (
                            <div className="p-4 bg-white shadow-md rounded-lg"> {/* Add padding and shadow to data container */}
                                <ClientData 
                        clients={filteredClients} 
                        onDeleteClient={handleDeleteConfirmation} // Pass handleDeleteConfirmation instead
                    />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientsPage;
