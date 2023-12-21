import fs from 'fs';
import path from 'path';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { recipient, agentId } = req.body;

        // Read the HTML file
        const templatePath = path.join(process.cwd(), 'templates', 'newAgentEmail.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholder with actual Agent ID
        htmlContent = htmlContent.replace('{{agentId}}', agentId);

        // Set up Mailgun client
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

        // Create and send the message
        mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: "The Smith Agency <mailgun@sandbox-123.mailgun.org>", // Update with your sender
            to: [recipient],
            subject: "Welcome to The Smith Agency",
            text: `Your Agent ID is: ${agentId}`, // You might want to remove this if HTML email is sufficient
            html: htmlContent
        })
        .then(msg => {
            console.log(msg);
            res.status(200).json({ message: 'Email sent successfully', msg });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error sending email', err });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
