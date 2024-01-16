import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const bookingData = req.body;

            // Validate bookingData here if needed

            const result = await db.collection('bookings').insertOne(bookingData);

            if (result.acknowledged) {
                res.status(200).json({ ...bookingData, _id: result.insertedId });
            } else {
                res.status(400).json({ message: 'Booking insertion failed' });
            }
        } catch (error) {
            console.error('Error adding booking to MongoDB', error);
            res.status(500).json({ message: 'Failed to add booking' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
