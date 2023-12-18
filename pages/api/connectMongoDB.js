import { client, run } from '../../lib/mongodb';

export default async function handler(req, res) {
  // Log the incoming request method
  console.log(`Received a ${req.method} request to the MongoDB handler`);

  // Check if the request method is GET
  if (req.method !== 'GET') {
    console.log(`Method Not Allowed: Received a ${req.method} request instead of a GET request`);
    return res.status(405).json({ message: 'Method Not Allowed, expected a GET request' });
  }

  console.log("Attempting to connect to MongoDB...");

  try {
    // Attempt to run the MongoDB client
    await run();
    console.log("Connected to MongoDB successfully");

    // Perform additional database operations here
    // Example code for database operations is commented out for reference
    // const db = client.db('yourDatabaseName');
    // const collection = db.collection('yourCollectionName');
    // const data = await collection.find({}).toArray();

    // Respond with success message or retrieved data
    // res.status(200).json({ data });
    res.status(200).json({ message: 'Successfully connected to MongoDB' });
  } catch (error) {
    console.error('MongoDB connection or operation error:', error);

    // Check if the error is related to the MongoDB client
    if (!client.isConnected()) {
      console.error('MongoDB client is not connected');
    }

    // Respond with detailed error information
    res.status(500).json({ 
      message: 'Failed to connect to MongoDB or perform database operation', 
      error: error.message 
    });
  }
}
