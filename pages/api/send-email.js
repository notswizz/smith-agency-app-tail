import fs from 'fs';
import path from 'path';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { recipient, agentId } = req.body;

        // Read the HTML file for the email content
        const templatePath = path.join(process.cwd(), 'templates', 'newAgentEmail.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Replace the placeholder in the HTML content with the actual Agent ID
        htmlContent = htmlContent.replace('{{agentId}}', agentId);

        // Set up Mailgun client with your API credentials
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

        // Create and send the email message
        try {
            const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
                from: "The Smith Agency <mailgun@sandbox-123.mailgun.org>", // Replace with your sender address
                to: [recipient],
                subject: "Welcome to The Smith Agency",
                text: `Your Agent ID is: ${agentId}`, // Optional: plain text content
                html: htmlContent // HTML content of the email
            });

            console.log(msg);
            res.status(200).json({ message: 'Email sent successfully', msg });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error sending email', err });
        }
    } else {
        // Handle incorrect method access
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
