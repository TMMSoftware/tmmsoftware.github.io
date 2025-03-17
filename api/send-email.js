import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers to allow requests from GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://tmmsoftware.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST for actual data submission
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse out email + tosAccepted
  const { email, tosAccepted } = req.body;

  // Validate presence
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!tosAccepted) {
    return res
      .status(400)
      .json({ error: 'You must accept the Terms of Service.' });
  }
  
  // Load HTML confirmation-email template from a file
  const emailTemplatePath = path.join(process.cwd(), 'api', 'templates', 'confirmation-email.html');
  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Thank you for joining TMM Software Early Access!',
      html: emailTemplate, // The loaded HTML file
    });

    return res.status(200).json({ message: 'Email sent successfully!', data });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
