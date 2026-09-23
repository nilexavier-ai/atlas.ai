const RESEND_API_URL = 'https://api.resend.com/emails';
const DEMO_RECIPIENT = 'atlasiq26@gmail.com';
const DEFAULT_SENDER = 'Atlas AI <onboarding@resend.dev>';

const limits = {
  firstName: 100,
  lastName: 100,
  email: 254,
  company: 200,
  message: 5000,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return response.status(500).json({ error: 'Unable to submit your request right now.' });
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {};
  const fields = Object.fromEntries(Object.keys(limits).map((key) => [
    key,
    typeof body[key] === 'string' ? body[key].trim() : '',
  ]));

  if (Object.values(fields).some((value) => !value)) {
    return response.status(400).json({ error: 'Please complete all required fields.' });
  }
  if (!emailPattern.test(fields.email) || fields.email.length > limits.email) {
    return response.status(400).json({ error: 'Please enter a valid work email address.' });
  }
  if (Object.entries(limits).some(([key, maximum]) => fields[key].length > maximum)) {
    return response.status(400).json({ error: 'One or more fields are too long.' });
  }

  const safe = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, escapeHtml(value)]));
  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_SENDER,
        to: [DEMO_RECIPIENT],
        reply_to: fields.email,
        subject: `New Atlas AI Demo Request — ${fields.company.replace(/[\r\n]/g, ' ')}`,
        html: `
          <h1>New Atlas AI Demo Request</h1>
          <p><strong>First name:</strong> ${safe.firstName}</p>
          <p><strong>Last name:</strong> ${safe.lastName}</p>
          <p><strong>Work email:</strong> ${safe.email}</p>
          <p><strong>Business name:</strong> ${safe.company}</p>
          <p><strong>What calls they need help with:</strong></p>
          <p>${safe.message.replace(/\r?\n/g, '<br>')}</p>`,
      }),
    });

    if (resendResponse.ok) return response.status(200).json({ success: true });
    console.error('Resend rejected a demo request:', resendResponse.status, await resendResponse.text());
  } catch (error) {
    console.error('Resend request failed:', error);
  }

  return response.status(502).json({ error: 'Unable to submit your request right now.' });
}
