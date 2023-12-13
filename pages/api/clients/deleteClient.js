import { client, run } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            await run();
            const db = client.db('TSA'); // Change 'TSA' to your database name
            const { id } = req.query;

            // Delete the client document
            const result = await db.collection('clients').deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Client deleted successfully' });
            } else {
                res.status(404).json({ message: 'Client not found' });
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            res.status(500).json({ message: 'Failed to delete client' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
