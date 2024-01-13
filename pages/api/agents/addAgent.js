import { client, run } from '../../../lib/mongodb';
import { s3Client } from '../../../lib/s3config';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error processing form:', err);
            return res.status(500).json({ message: 'Form processing error' });
        }

        processForm(fields, files, res).catch(error => {
            console.error('Error in processForm:', error);
            res.status(500).json({ message: 'Server error' });
        });
    });
}

async function processForm(fields, files, res) {
    try {
        await run();
        console.log('MongoDB client run successful');
        const db = client.db('TSA');
        let agentData = {};

        // Processing form fields
        Object.keys(fields).forEach(field => {
            if (field === 'location') {
                agentData[field] = fields[field] instanceof Array
                    ? fields[field].flatMap(item => item.split(','))
                    : fields[field].split(',');
            } else {
                agentData[field] = fields[field] instanceof Array && fields[field].length === 1
                    ? fields[field][0]
                    : fields[field];
            }
        });

        // Initialize availability as an empty array
        agentData.availability = [];

        // Handle image upload if present
        if (files.image && files.image.size > 0) {
            const image = files.image;
            const imageKey = `agents/${uuidv4()}_${image.originalFilename}`;
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageKey,
                Body: fs.createReadStream(image.filepath),
                ContentType: image.mimetype
            });

            await s3Client.send(command);
            const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${imageKey}`;
            agentData.imageUrl = imageUrl;
        } else {
            console.log('Image file not found or empty');
        }

        const existingAgent = await db.collection('agents').findOne({ email: agentData.email });
        if (existingAgent) {
            // Update existing agent
            await db.collection('agents').updateOne(
                { email: agentData.email },
                { $set: agentData }
            );
            console.log('Agent updated successfully');
            return res.status(200).json({ message: 'Agent updated successfully', ...agentData });
        } else {
            // Handle image upload if present
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
                const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${imageKey}`;
                agentData.imageUrl = imageUrl;
            } else {
                console.log('Image file not found');
            }

            // Handle resume upload if present
            if (files.resume && files.resume.length > 0) {
                const resume = files.resume[0];
                const resumeKey = `resumes/${uuidv4()}_${resume.originalFilename}`;
                const resumeCommand = new PutObjectCommand({
                    Bucket: process.env.AWS_RESUME_BUCKET_NAME,
                    Key: resumeKey,
                    Body: fs.createReadStream(resume.filepath),
                    ContentType: resume.mimetype
                });

                await s3Client.send(resumeCommand);
                const resumeUrl = `https://${process.env.AWS_RESUME_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${resumeKey}`;
                agentData.resumeUrl = resumeUrl;
            } else {
                console.log('Resume file not found');
            } 

            // Insert new agent into database
            const result = await db.collection('agents').insertOne(agentData);
            if (result.acknowledged) {
                return res.status(200).json({ message: 'Agent added successfully', ...agentData, _id: result.insertedId });
                } else {
                return res.status(400).json({ message: 'Agent insertion failed' });
                }
                }
                } catch (error) {
                console.error('Error adding or updating agent in MongoDB', error);
                return res.status(500).json({ message: 'Failed to add or update agent' });
                }
                }
