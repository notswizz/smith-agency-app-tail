// addAvailability.js
import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Request Body:", req.body); // Add this line
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const availabilityData = req.body;

            // Validate the data
            if (!availabilityData.agent || !availabilityData.show || !availabilityData.availability) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Here you might want to validate the agent ID, show ID, and the structure of the availability object
            // For example, ensuring the agent ID and show ID exist in their respective collections
            // and that the availability object has the correct format

            // Insert the new availability document
            const result = await db.collection('availability').insertOne(availabilityData);

            if (result.acknowledged) {
                res.status(200).json({ ...availabilityData, _id: result.insertedId });
            } else {
                res.status(400).json({ message: 'Availability insertion failed' });
            }
        } catch (error) {
            console.error('Error adding availability to MongoDB', error);
            res.status(500).json({ message: 'Failed to add availability' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
