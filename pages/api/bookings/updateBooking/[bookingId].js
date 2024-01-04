// In your /api/bookings/updateBooking/[bookingId].js file
import { ObjectId } from 'mongodb';
import { client, run } from '../../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            await run();
            const db = client.db('TSA');
            const bookingsCollection = db.collection('bookings');

            const { bookingId } = req.query; // Get the bookingId from the URL

// Check if bookingId is a valid ObjectId
if (!ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
}

const _id = new ObjectId(bookingId); // Convert bookingId to ObjectId
const updatedBookingData = req.body;

console.log('Updating booking with ID:', bookingId);
console.log('Updated booking data:', updatedBookingData);

// Update the booking
const result = await bookingsCollection.updateOne({ _id }, { $set: updatedBookingData });

console.log('Modified count:', result.modifiedCount);

if (result.modifiedCount === 0) {
    return res.status(404).json({ message: 'Booking not found' });
}

res.status(200).json({ message: 'Booking updated successfully' });
        } catch (error) {
            console.error('Error updating booking in MongoDB', error);
            res.status(500).json({ message: 'Error updating booking' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
