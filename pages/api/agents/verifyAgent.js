// File: /pages/api/agents/verifyAgent.js

import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const agentId = req.query.agentId; // Retrieve the agent ID from the query parameters

        if (!agentId) {
            return res.status(400).json({ message: 'Agent ID is required' });
        }

        try {
            await run();
            const db = client.db('TSA'); // Update with your actual database name

            const agent = await db.collection('agents').findOne({ agent_id: agentId });

            if (agent) {
                res.status(200).json(agent); // Return the found agent
            } else {
                res.status(404).json({ message: `Agent with ID ${agentId} not found` });
            }
        } catch (error) {
            console.error('Error in /api/agents/verifyAgent', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
