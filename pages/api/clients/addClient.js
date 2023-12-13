import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA'); // Replace 'TSA' with your actual database name
            const clientData = req.body;

            // Insert the new client document into the 'clients' collection
            const result = await db.collection('clients').insertOne(clientData);

            if (result.acknowledged) {
                // Send back the inserted client data with the generated _id
                res.status(200).json({ ...clientData, _id: result.insertedId });
            } else {
                res.status(400).json({ message: 'Client insertion failed' });
            }
        } catch (error) {
            console.error('Error adding client to MongoDB', error);
            res.status(500).json({ message: 'Failed to add client' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
