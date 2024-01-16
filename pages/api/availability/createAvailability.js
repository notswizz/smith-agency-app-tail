import { client, run } from '../../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const { agentEmail, dateToBook, notes } = req.body;

            console.log("Received agentEmail:", agentEmail);
            console.log("Received dateToBook:", dateToBook);

            // Generate a unique ID for the availability entry
            const availabilityId = uuidv4();

            // Check if an availability entry for the same date already exists
            const agent = await db.collection('agents').findOne({ "email": agentEmail, "availability.date": dateToBook });

            if (agent) {
                // If an entry exists, skip adding a new one
                res.status(200).json({ message: 'Availability entry already exists' });
            } else {
                // If no entry exists, add a new one
                const result = await db.collection('agents').updateOne(
                    { "email": agentEmail },
                    { $push: { "availability": { id: availabilityId, date: dateToBook, status: "open", notes: notes } } },
                    { upsert: true }
                );

                if (result.modifiedCount === 0 && result.upsertedCount === 0) {
                    res.status(404).json({ message: 'Failed to update availability entry' });
                } else {
                    res.status(200).json({ message: 'Availability entry updated successfully' });
                }
            }
        } catch (error) {
            console.error('Error updating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update availability', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}