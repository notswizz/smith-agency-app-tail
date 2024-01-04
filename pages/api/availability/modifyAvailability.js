import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const { agentPhone, dateToBook } = req.body; // Using agentPhone instead of agentId

            console.log("Received agentPhone:", agentPhone);
            console.log("Received dateToBook:", dateToBook);
             // Basic validation for agentPhone to check if it's likely a phone number
    if (!agentPhone || !/^\d{10}$/.test(agentPhone)) {
        return res.status(400).json({ message: 'Invalid or missing agent phone number' });
    }

            if (!agentPhone) {
                return res.status(400).json({ message: 'Agent phone number is required' });
            }

            if (!dateToBook) {
                return res.status(400).json({ message: 'Date to book is required' });
            }

            const result = await db.collection('agents').updateOne(
                { "phone": agentPhone, "availability.date": dateToBook },
                { $set: { "availability.$.status": "booked" } }
            );

            console.log("MongoDB update result:", result);

            if (result.modifiedCount === 0) {
                res.status(404).json({ message: 'Agent or date not found' });
            } else {
                res.status(200).json({ message: 'Availability updated successfully' });
            }
        } catch (error) {
            console.error('Error updating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update availability', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
