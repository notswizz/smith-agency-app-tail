import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        try {
            await run();
            const db = client.db('TSA'); // Replace with your database name
            const showsCollection = db.collection('shows');
            
            const { id } = req.query; // Extracting 'id' from the request query
            const { ObjectId } = require('mongodb');
            const filter = { _id: new ObjectId(id) };
            
            const updateDoc = {
                $set: { active: false },
            };

            const result = await showsCollection.updateOne(filter, updateDoc);

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Show not found or already archived' });
            }

            res.status(200).json({ message: 'Show archived successfully' });
        } catch (error) {
            console.error('Error archiving show in MongoDB', error);
            res.status(500).json({ message: 'Failed to archive show' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
