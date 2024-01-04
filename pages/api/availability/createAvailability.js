import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const { agentPhone, dateToBook } = req.body; // Assuming you use agentPhone and dateToBook

            console.log("Received agentPhone:", agentPhone);
            console.log("Received dateToBook:", dateToBook);

            // Validate input
            if (!agentPhone || !dateToBook) {
                return res.status(400).json({ message: 'Agent phone number and date to book are required' });
            }

            // Create a new availability entry
            const result = await db.collection('agents').updateOne(
                { "phone": agentPhone },
                { $addToSet: { "availability": { date: dateToBook, status: "open" } } },
                { upsert: true } // This creates a new document if no matching document is found
            );

            if (result.modifiedCount === 0 && result.upsertedCount === 0) {
                res.status(404).json({ message: 'Failed to create new availability entry' });
            } else {
                res.status(200).json({ message: 'Availability entry created successfully' });
            }
        } catch (error) {
            console.error('Error creating availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to create availability', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
