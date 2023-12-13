import { client, run } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await run();
      // Here you can add any database operations you wish to perform
      // For demonstration, we're just sending a success message
      res.status(200).json({ message: 'Successfully connected to MongoDB' });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      res.status(500).json({ message: 'Failed to connect to MongoDB' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
