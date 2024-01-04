import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const { agentPhone, availabilityDates } = req.body;

            if (!agentPhone || !Array.isArray(availabilityDates)) {
                return res.status(400).json({ message: 'Missing or invalid required fields' });
            }

            // Ensure that availability is properly initialized
            let availability = [];

            // Update to set each day as 'open' initially
            availability = availabilityDates.map(date => ({ date, status: 'open' }));

            // Updating the agent's availability
            const result = await db.collection('agents').updateOne(
                { phone: agentPhone },
                { $set: { availability: availability } }
            );

            if (result.modifiedCount > 0) {
                res.status(200).json({ message: 'Availability updated successfully' });
            } else {
                res.status(400).json({ message: 'No agent found with the given phone number' });
            }
        } catch (error) {
            console.error('Error updating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update availability' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
