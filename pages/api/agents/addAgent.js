import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const agentData = req.body;

            // Check for required fields
            const requiredFields = ['name', 'email', 'phone', 'location', 'instagram'];
            for (const field of requiredFields) {
                if (!agentData[field]) {
                    return res.status(400).json({ message: `Missing required field: ${field}` });
                }
            }

            // Check for duplicate agent based on unique fields like email or phone
            const existingAgent = await db.collection('agents').findOne({ email: agentData.email });
            if (existingAgent) {
                return res.status(409).json({ message: 'An agent with this email already exists' });
            }

            // Insert the new agent document
            const result = await db.collection('agents').insertOne(agentData);

            if (result.acknowledged) {
                res.status(200).json({ ...agentData, _id: result.insertedId });
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
