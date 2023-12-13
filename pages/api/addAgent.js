import { client, run } from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run(); // Ensure connection to MongoDB
            const db = client.db('TSA');
            const agent = req.body;

            // Required fields
            const requiredFields = ['name', 'email', 'phone'];
            const missingFields = requiredFields.filter(field => !agent[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            }

            // Check for duplicate agent based on email
            const existingAgent = await db.collection('agents').findOne({ email: agent.email });
            if (existingAgent) {
                return res.status(409).json({ message: 'An agent with this email already exists' });
            }

            // Insert the new agent document
            const result = await db.collection('agents').insertOne(agent);

            if (result.acknowledged) {
                res.status(200).json({ message: 'Agent added successfully', id: result.insertedId });
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
