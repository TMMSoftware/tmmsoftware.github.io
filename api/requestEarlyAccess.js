export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email } = req.body;
  
  // Basic validation: Check if email is provided
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Simple email format validation
  const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  try {
    // Call the Resend API to send a confirmation email
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',  // Change to your verified sender email
        to: email,
        subject: 'Confirmation Email for Early Access',
        html: `<p>Thank you for requesting early access!</p>`
      })
    });
    
    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: 'Resend API error', details: errData });
    }
    
    const data = await response.json();
    return res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error calling Resend API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
