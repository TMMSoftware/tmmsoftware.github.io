import { Resend } from 'resend';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Confirmation Email for Early Access Waitlist!',
            html: '<p>Thank you for signing up for early access waitlist!</p>'
        });

        return res.status(200).json({ success: true, response });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send email" });
    }
}
