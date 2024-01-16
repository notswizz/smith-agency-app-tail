import { ObjectId } from 'mongodb';
import { client, run } from '../../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await run();
            const db = client.db('TSA');
            const bookingsCollection = db.collection('bookings');

            const { bookingId } = req.query;

            if (!ObjectId.isValid(bookingId)) {
                return res.status(400).json({ message: 'Invalid booking ID' });
            }

            const _id = new ObjectId(bookingId);
            const requestBody = req.body;

            // Extract updated booking data from the 'params' property of the request body
            const updatedBookingData = requestBody.params;

            // Map the incoming data to the booking structure
            const updateData = {
                show: updatedBookingData.show,
                client: updatedBookingData.client,
                startDate: updatedBookingData.startDate,
                endDate: updatedBookingData.endDate,
                agentCounts: updatedBookingData.agentCounts,
                notes: updatedBookingData.notes,
                id: updatedBookingData.id, // Ensure this field should be updated
                totalDays: updatedBookingData.totalDays,
                agentSelection: updatedBookingData.agentSelection
            };

            console.log('Updating booking with ID:', bookingId);
            console.log('Updated booking data:', updateData);

            const result = await bookingsCollection.updateOne(
                { _id },
                { $set: updateData }
            );

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
