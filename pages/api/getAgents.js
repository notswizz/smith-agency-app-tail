import { client, run } from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your actual database name

            const agents = await db.collection('agents').find({}).toArray();
            res.status(200).json(agents);
        } catch (error) {
            console.error('Error fetching agents from MongoDB', error);
            res.status(500).json({ message: 'Failed to fetch agents' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
