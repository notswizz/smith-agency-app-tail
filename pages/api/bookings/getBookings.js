import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await run();
            const db = client.db('TSA');
            const bookingsCollection = db.collection('bookings');

            const bookings = await bookingsCollection.find({}).toArray();

            res.status(200).json(bookings);
        } catch (error) {
            console.error('Error fetching bookings from MongoDB', error);
            res.status(500).json({ message: 'Failed to fetch bookings' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
