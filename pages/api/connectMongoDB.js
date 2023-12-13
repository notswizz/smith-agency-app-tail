import { client, run } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log("Attempting to connect to MongoDB...");

    try {
      await run();
      console.log("Connected to MongoDB successfully");

      // Here you can add any additional database operations you wish to perform
      // For demonstration, we're just sending a success message
      res.status(200).json({ message: 'Successfully connected to MongoDB' });
    } catch (error) {
      console.error('MongoDB connection error:', error);

      // You can add more detailed error information here if necessary
      res.status(500).json({ message: 'Failed to connect to MongoDB', error: error.message });
    }
  } else {
    console.log("Received a non-GET request");
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
