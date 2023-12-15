import React from 'react';

const ClientData = ({ clients, onDeleteClient }) => {
    return (
        <div className="flex flex-col space-y-4 max-h-96 overflow-auto"> {/* Set a fixed max-height and make it scrollable */}
            {clients.map(client => (
                <div className="bg-white p-4 rounded shadow-md" key={client._id}> {/* Use _id for keys */}
                    <h3 className="text-lg font-bold">
                      <a href={client.website.startsWith('http') ? client.website : `http://${client.website}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800">
                         {client.company}
                      </a>
                    </h3>
                    <p className="text-gray-600">{client.contact}</p>
                    <p className="text-gray-600">{client.email}</p>
                    <p className="text-gray-600">Booth: {client.boothLocation}</p>
                    <button onClick={() => onDeleteClient(client._id)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button> {/* Use _id for deletion */}
                </div>
            ))}
        </div>
    );
};

export default ClientData;
