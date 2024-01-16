import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            await run();
            const db = client.db('TSA');
            const bookingsCollection = db.collection('bookings');

            const { _id, show, client, startDate, endDate, agentCounts, notes, id, totalDays, agentSelection } = req.body;

            // Find the existing booking by its _id
            const existingBooking = await bookingsCollection.findOne({ _id: _id });

            if (existingBooking) {
                // Apply partial updates
                if (show) {
                    existingBooking.show = show;
                }
                if (client) {
                    existingBooking.client = client;
                }
                if (startDate) {
                    existingBooking.startDate = startDate;
                }
                if (endDate) {
                    existingBooking.endDate = endDate;
                }
                if (agentCounts) {
                    existingBooking.agentCounts = agentCounts;
                }
                if (notes) {
                    existingBooking.notes = notes;
                }
                if (id) {
                    existingBooking.id = id;
                }
                if (totalDays) {
                    existingBooking.totalDays = totalDays;
                }
                if (agentSelection) {
                    existingBooking.agentSelection = agentSelection;
                }

                // Update the booking in the database
                const result = await bookingsCollection.updateOne({ _id: _id }, { $set: existingBooking });

                if (result.matchedCount === 1) {
                    res.status(200).json({ message: 'Booking updated successfully' });
                } else {
                    console.error('Failed to update booking - No matching booking found');
                    res.status(404).json({ message: 'Booking not found' });
                }
            } else {
                console.error('Failed to update booking - Booking not found');
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            console.error('Error updating booking in MongoDB', error);
            res.status(500).json({ message: 'Failed to update booking' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
