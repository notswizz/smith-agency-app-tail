import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const { agentPhone, dateToBook, status } = req.body;

            // Log the received data for debugging
            console.log("Received agentPhone:", agentPhone);
            console.log("Received dateToBook:", dateToBook);
            console.log("Received status:", status);

            // Basic validation for agentPhone to check if it's likely a phone number
            if (!agentPhone || !/^\d{10}$/.test(agentPhone)) {
                return res.status(400).json({ message: 'Invalid or missing agent phone number' });
            }

            if (!dateToBook) {
                return res.status(400).json({ message: 'Date to book is required' });
            }

            // Update the status for the specified date in the availability array
            const result = await db.collection('agents').updateOne(
                { "phone": agentPhone, "availability.date": dateToBook },
                { $set: { "availability.$.status": status } }
            );

            // Check if the document was found and updated
            if (result.matchedCount === 0 || result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Agent or date not found' });
            }

            // Respond with success message
            res.status(200).json({ message: 'Availability updated successfully' });

        } catch (error) {
            console.error('Error updating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to update availability', error: error.message });
        }
    } else {
        // Respond with Method Not Allowed for non-POST requests
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
