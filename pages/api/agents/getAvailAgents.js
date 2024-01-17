import { client, run } from '../../../lib/mongodb';
import moment from 'moment';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await run();
            const db = client.db('TSA');

            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ message: 'Date parameter is required' });
            }

            // Ensure the date format matches the format in the agent structure
            const formattedDate = moment(date).format('MMMM DD, YYYY'); 

            const availableAgents = await db.collection('agents').find({
                "availability": {
                    $elemMatch: { "date": formattedDate, "status": "open" }
                }
            }).toArray();

            res.status(200).json(availableAgents);
        } catch (error) {
            console.error('Error fetching available agents from MongoDB', error);
            res.status(500).json({ message: 'Failed to fetch available agents' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
