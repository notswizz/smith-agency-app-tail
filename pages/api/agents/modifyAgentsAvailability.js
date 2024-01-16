// pages/api/agents/modifyAgentAvailability.js
import { client, run } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            const { agentId } = req.query; // Get the agentId from the URL
            const availabilityData = req.body; // Get the new availability data from the request body

            await run();
            const db = client.db('TSA');

            // Update the agent's availability using the ObjectId to ensure the document is uniquely identified.
            const result = await db.collection('agents').updateOne(
                { _id: new ObjectId(agentId) },
                { $set: { availability: availabilityData } } // Update only the availability field
            );

            if (result.modifiedCount === 1) {
                // If the agent's availability was updated, return the updated document
                const updatedAgent = await db.collection('agents').findOne({ _id: new ObjectId(agentId) });
                res.status(200).json(updatedAgent);
            } else {
                res.status(404).json({ message: 'Agent not found or no changes made' });
            }
        } catch (error) {
            console.error('Error updating agent availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update agent availability' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}