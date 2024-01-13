import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        try {
            await run();
            const db = client.db('TSA'); // Replace with your actual database name

            const agent = await db.collection('agents').findOne({ email: email });
            if (agent) {
                res.status(200).json(agent);
            } else {
                res.status(404).json({ message: 'Agent not found' });
            }
        } catch (error) {
            console.error('Error fetching agent from MongoDB', error);
            res.status(500).json({ message: 'Failed to fetch agent' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
