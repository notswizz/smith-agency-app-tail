import { client, run } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            await run();
            const db = client.db('TSA');
            const { id } = req.query;

            const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Booking deleted successfully' });
            } else {
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            res.status(500).json({ message: 'Failed to delete booking' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
