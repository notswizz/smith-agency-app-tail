import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const { agentEmail, showId } = req.body;

            // Remove availability entries associated with the specified show
            const result = await db.collection('agents').updateOne(
                { "email": agentEmail },
                { $pull: { "availability": { showId: showId } } } // Adjust this query based on your data structure
            );

            if (result.modifiedCount === 0) {
                res.status(404).json({ message: 'No availability entries found for the specified show' });
            } else {
                res.status(200).json({ message: 'Availability entries cleared successfully' });
            }
        } catch (error) {
            console.error('Error clearing availability in MongoDB', error);
            res.status(500).json({ message: 'Failed to clear availability', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
