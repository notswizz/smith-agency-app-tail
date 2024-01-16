// pages/api/bookings/updateBooking/[bookingId].js
import { client, run } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            const { bookingId } = req.query; // Get the bookingId from the URL
            await run();
            const db = client.db('TSA');
            const bookingData = req.body;

            // Validate bookingData here if needed
            // Specifically, make sure the agentSelection array structure is as expected
            // Example validation could check the length of the array, presence of required fields, etc.
            if (!Array.isArray(bookingData.agentSelection)) {
                return res.status(400).json({ message: 'Invalid agent selection data' });
            }        
            // Update the booking using the ObjectId to ensure the document is uniquely identified.
            const result = await db.collection('bookings').updateOne(
                { _id: new ObjectId(bookingId) },
                { $set: { agentSelection: bookingData.agentSelection } } // Update only the agentSelection field
            );

            if (result.modifiedCount === 1) {
                // If the booking was updated, return the updated document
                const updatedBooking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });
                res.status(200).json(updatedBooking);
            } else {
                res.status(404).json({ message: 'Booking not found or no changes made' });
            }
        } catch (error) {
            console.error('Error updating booking in MongoDB', error);
            res.status(500).json({ message: 'Failed to update booking' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}