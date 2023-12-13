import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const showData = req.body;

            // Additional validation can be added here if needed

            const result = await db.collection('shows').insertOne(showData);

            if (result.acknowledged) {
                res.status(200).json({ ...showData, _id: result.insertedId });
            } else {
                res.status(400).json({ message: 'Show insertion failed' });
            }
        } catch (error) {
            console.error('Error adding show to MongoDB', error);
            res.status(500).json({ message: 'Failed to add show' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
