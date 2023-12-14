import { client, run } from '../../lib/mongodb';

export default async function handler(req, res) {
  // Log the incoming request method for debugging purposes
  console.log(`Received a ${req.method} request to the MongoDB handler`);

  if (req.method === 'GET') {
    console.log("Attempting to connect to MongoDB...");

    try {
      // Attempt to run the MongoDB client
      await run();
      console.log("Connected to MongoDB successfully");

      // Perform any additional database operations here
      // For example, querying a collection or retrieving specific data
      // const db = client.db('yourDatabaseName');
      // const collection = db.collection('yourCollectionName');
      // const data = await collection.find({}).toArray();

      // Respond with success message or the retrieved data
      // res.status(200).json({ data });
      res.status(200).json({ message: 'Successfully connected to MongoDB' });
    } catch (error) {
      // Log detailed error message if the connection or any database operation fails
      console.error('MongoDB connection or operation error:', error);

      // Respond with detailed error information
      res.status(500).json({ 
        message: 'Failed to connect to MongoDB or perform database operation', 
        error: error.message 
      });
    }
  } else {
    // Log if a non-GET request is received
    console.log(`Method Not Allowed: Received a ${req.method} request instead of a GET request`);
    res.status(405).json({ message: 'Method Not Allowed, expected a GET request' });
  }
}
