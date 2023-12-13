import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your actual database name
            const clientsCollection = db.collection('clients');

            const clients = await clientsCollection.find({}).toArray();

            res.status(200).json(clients);
        } catch (error) {
            console.error('Error fetching clients from MongoDB', error);
            res.status(500).json({ message: 'Failed to fetch clients' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
