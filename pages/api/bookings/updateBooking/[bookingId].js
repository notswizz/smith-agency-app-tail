import { client, run } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            await run();
            const db = client.db('TSA');
            let bookingData = req.body;

            // Remove _id from bookingData if it exists
            delete bookingData._id;

            const bookingId = new ObjectId(req.query.bookingId);

            const result = await db.collection('bookings').updateOne(
                { _id: bookingId },
                { $set: bookingData }
            );

            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'Booking updated successfully' });
            } else {
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            console.error('Error updating booking in MongoDB', error);
            res.status(500).json({ message: 'Failed to update booking', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
