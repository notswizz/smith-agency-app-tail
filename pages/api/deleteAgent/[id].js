import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            await run();
            const db = client.db('TSA');
            const { id } = req.query;

            // Use the custom ID directly
            const result = await db.collection('agents').deleteOne({ id: id });

            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Agent deleted successfully' });
            } else {
                res.status(404).json({ message: 'Agent not found' });
            }
        } catch (error) {
            console.error('Error deleting agent:', error);
            res.status(500).json({ message: 'Failed to delete agent' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
