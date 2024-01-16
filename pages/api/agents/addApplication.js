import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await run();
        console.log('MongoDB client run successful');

        // Extract application data from the request body
        const { name, referral, phoneNumber } = req.body;

        // Define the application data object
        let applicationData = {
            name: name || '',
            referral: referral || '',
            phoneNumber: phoneNumber || ''
        };

        // Insert the application data into the database
        const db = client.db('TSA');
        const result = await db.collection('applications').insertOne(applicationData);

        // Handle the response based on the insertion result
        if (result.acknowledged) {
            return res.status(200).json({ ...applicationData, _id: result.insertedId });
        } else {
            return res.status(400).json({ message: 'Application insertion failed' });
        }
    } catch (error) {
        console.error('Error in DB operation:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
