import { client, run } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const { agentId, dateToBook } = req.body; // Use agentId instead of agentPhone

            if (!agentId || !dateToBook) {
                return res.status(400).json({ message: 'Missing or invalid required fields' });
            }

            // Update the agent's availability for the given date to 'booked'
            const result = await db.collection('agents').updateOne(
                { "_id": ObjectId(agentId), "availability.date": dateToBook }, // Use ObjectId to match the agentId
                { $set: { "availability.$.status": "booked" } }
            );

            if (result.modifiedCount === 0) {
                res.status(404).json({ message: 'Agent or date not found' });
            } else {
                res.status(200).json({ message: 'Availability updated successfully' });
            }
        } catch (error) {
            console.error('Error updating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update availability' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
