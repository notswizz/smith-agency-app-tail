import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const { agentPhone, availabilityId, status } = req.body; // Use availabilityId

            // Log the received data for debugging
            console.log("Received agentPhone:", agentPhone);
            console.log("Received availabilityId:", availabilityId);
            console.log("Received status:", status);

            // Basic validation
            if (!agentPhone || !availabilityId) {
                return res.status(400).json({ message: 'Agent phone number and availability ID are required' });
            }

            // Update the status for the specified availability ID
            const result = await db.collection('agents').updateOne(
                { "phone": agentPhone, "availability.id": availabilityId },
                { $set: { "availability.$.status": status } }
            );

            // Check if the document was found and updated
            if (result.matchedCount === 0 || result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Agent or availability entry not found' });
            }

            res.status(200).json({ message: 'Availability updated successfully' });
        } catch (error) {
            console.error('Error updating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update availability', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
