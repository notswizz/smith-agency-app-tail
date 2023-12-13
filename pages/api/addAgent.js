import { client, run } from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const agent = req.body;

        

            // Insert the new agent document
            const result = await db.collection('agents').insertOne(agent);

            if (result.acknowledged) {
                res.status(200).json(agent);
            } else {
                res.status(400).json({ message: 'Agent insertion failed' });
            }
        } catch (error) {
            console.error('Error adding agent to MongoDB', error);
            res.status(500).json({ message: 'Failed to add agent' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
