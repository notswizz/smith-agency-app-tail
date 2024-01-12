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
        let applicationData = {};

        // Processing form fields
        Object.keys(fields).forEach(field => {
            applicationData[field] = fields[field];
        });

        // Handle resume upload
        if (files.resume && files.resume.length > 0) {
            const resume = files.resume[0];
            const resumeKey = `resumes/${uuidv4()}_${resume.originalFilename}`;
            const resumeCommand = new PutObjectCommand({
                Bucket: process.env.AWS_RESUME_BUCKET_NAME, // Assuming you have a separate bucket for resumes
                Key: resumeKey,
                Body: fs.createReadStream(resume.filepath),
                ContentType: resume.mimetype
            });

            await s3Client.send(resumeCommand);
            const resumeUrl = `https://${process.env.AWS_RESUME_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${resumeKey}`;
            applicationData.resumeUrl = resumeUrl;
        } else {
            console.log('Resume file not found');
        }

        // Insert new application into database
        const result = await db.collection('applications').insertOne(applicationData);
        if (result.acknowledged) {
            return res.status(200).json({ ...applicationData, _id: result.insertedId });
        } else {
            return res.status(400).json({ message: 'Application insertion failed' });
        }
    } catch (error) {
        console.error('Error adding application to MongoDB', error);
        return res.status(500).json({ message: 'Failed to add application' });
    }
}
