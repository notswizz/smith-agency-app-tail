import React from 'react';
import { TrashBinOutline } from 'react-ionicons';

const ClientData = ({ clients, onDeleteClient }) => {
    return (
        <div className="flex flex-col space-y-4 max-h-96 overflow-auto">
            {clients.map(client => (
                <div className="bg-white p-4 rounded shadow-md flex justify-between items-center" key={client._id}>
                    <div>
                        <h3 className="text-lg font-bold">
                        <a href={client.website && client.website.startsWith('http') ? client.website : `http://${client.website}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-800">
                             {client.company}
                          </a>
                        </h3>
                        <p className="text-gray-600">{client.contact}</p>
                        <p className="text-gray-600">{client.email}</p>
                        <p className="text-gray-600">{client.clientType}</p>
                        <p className="text-gray-600">Booth: {client.boothLocation}</p>
                    </div>
                    <TrashBinOutline
                        color={'#f56565'} // Tailwind red-500
                        title={"Delete client"}
                        height="25px"
                        width="25px"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onDeleteClient(client._id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ClientData;
