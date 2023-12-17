import { client, run } from '../../../lib/mongodb';
import { s3Client } from '../../../lib/s3config'; // Ensure this matches your updated s3config file
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3'; // Import from AWS SDK v3

// Disable Next.js body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error processing form:', err);
                return res.status(500).json({ message: 'Form processing error' });
            }

            try {
                await run();
                const db = client.db('TSA'); // Replace with your database name
                let agentData = fields;

                // Check for required fields
                const requiredFields = ['name', 'email', 'phone', 'location', 'instagram'];
                for (const field of requiredFields) {
                    if (!agentData[field]) {
                        return res.status(400).json({ message: `Missing required field: ${field}` });
                    }
                }

                // Check for duplicate agent
                const existingAgent = await db.collection('agents').findOne({ email: agentData.email });
                if (existingAgent) {
                    return res.status(409).json({ message: 'An agent with this email already exists' });
                }

               // Handle image upload to S3
if (files.image && files.image.length > 0) {
    const image = files.image[0];
    const imageKey = `agents/${uuidv4()}_${image.originalFilename}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: fs.createReadStream(image.filepath),
        ContentType: image.mimetype
    });

    await s3Client.send(command);

    // Construct the URL of the uploaded file
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${imageKey}`;
    agentData.imageUrl = imageUrl;
} else {
    console.log('Image file not found');
}


                // Insert the new agent document
                const result = await db.collection('agents').insertOne(agentData);

                if (result.acknowledged) {
                    res.status(200).json({ ...agentData, _id: result.insertedId });
                } else {
                    res.status(400).json({ message: 'Agent insertion failed' });
                }
            } catch (error) {
                console.error('Error adding agent to MongoDB', error);
                res.status(500).json({ message: 'Failed to add agent' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
