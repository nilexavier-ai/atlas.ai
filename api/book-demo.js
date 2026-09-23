const RECIPIENT = 'atlasiq26@gmail.com';
const DEFAULT_FROM = 'Atlas AI <onboarding@resend.dev>';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const readBody = (body) => {
  if (typeof body === 'string') return JSON.parse(body);
  return body ?? {};
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return response.status(500).json({ error: 'Email service is not configured.' });
  }

  try {
    const body = readBody(request.body);
    const fields = ['firstName', 'lastName', 'email', 'company', 'message'];
    const values = Object.fromEntries(fields.map((field) => [field, String(body[field] ?? '').trim()]));

    if (fields.some((field) => !values[field])) {
      return response.status(400).json({ error: 'Please complete every field.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return response.status(400).json({ error: 'Please enter a valid work email.' });
    }
    if (Object.values(values).some((value) => value.length > 5000)) {
      return response.status(400).json({ error: 'One or more fields are too long.' });
    }

    const safe = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, escapeHtml(value)]));
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
        to: [RECIPIENT],
        reply_to: values.email,
        subject: `New Atlas AI Demo Request — ${values.company}`,
        text: `First name: ${values.firstName}\nLast name: ${values.lastName}\nWork email: ${values.email}\nBusiness name: ${values.company}\n\nWhat calls they need help with:\n${values.message}`,
        html: `<h2>New Atlas AI Demo Request</h2><p><strong>First name:</strong> ${safe.firstName}</p><p><strong>Last name:</strong> ${safe.lastName}</p><p><strong>Work email:</strong> ${safe.email}</p><p><strong>Business name:</strong> ${safe.company}</p><p><strong>What calls they need help with:</strong></p><p>${safe.message.replaceAll('\n', '<br>')}</p>`,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      console.error('Resend request failed:', resendResponse.status, details);
      return response.status(502).json({ error: 'We could not send your request. Please try again.' });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Book demo submission failed:', error);
    return response.status(500).json({ error: 'We could not send your request. Please try again.' });
  }
}
