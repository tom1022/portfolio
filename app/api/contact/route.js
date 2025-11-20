import { NextResponse } from 'next/server';
import { verifyTurnstile } from '@/actions';

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body.name || '匿名';
    const email = body.email || '不明';
    const message = body.message || '';
    const token = body['cf-turnstile-response'] || body.turnstile || '';

    if (!token) {
      return NextResponse.json({ success: false, error: 'Turnstile token missing' }, { status: 400 });
    }

    // verifyTurnstile expects a form-like object with get()
    const verification = await verifyTurnstile({ get: (k) => (k === 'cf-turnstile-response' ? token : null) });

    if (!verification || !verification.success) {
      return NextResponse.json({ success: false, error: verification?.error || 'Turnstile verification failed' }, { status: 401 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL is not set');
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const content = `**New contact message**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`;

    // Use Discord webhook with an embed for nicer formatting
    const payload = {
      embeds: [
        {
          title: 'New contact from portfolio',
          color: 5814783,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Message', value: message || '（空）' }
          ],
          footer: { text: 'portfolio contact form' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Discord webhook error', await res.text());
      return NextResponse.json({ success: false, error: 'Failed to send webhook' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in /api/contact', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
