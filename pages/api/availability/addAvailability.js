import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Request Body:", req.body); // Debugging
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const availabilityData = req.body;

            // Validate the data
            if (!availabilityData.agent || !availabilityData.show || !Array.isArray(availabilityData.availability)) {
                return res.status(400).json({ message: 'Missing or invalid required fields' });
            }

            // Additional validation can go here, such as checking if the agent and show exist in the database
            // and validating the structure of each item in the availability array

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
