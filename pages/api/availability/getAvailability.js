import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name

            // Fetch availability data from the database
            const availabilityData = await db.collection('availability').find({}).toArray();

            if (availabilityData) {
                res.status(200).json(availabilityData);
            } else {
                res.status(404).json({ message: 'No availability data found' });
            }
        } catch (error) {
            console.error('Error fetching availability from MongoDB', error);
            res.status(500).json({ message: 'Failed to fetch availability' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
