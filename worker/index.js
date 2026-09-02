const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstile(token, secretKey) {
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Turnstileトークンが見つかりません。' };
  }
  if (!secretKey) {
    return { success: false, error: 'サーバー設定エラーが発生しました。' };
  }
  const body = new URLSearchParams({ secret: secretKey, response: token });
  const response = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await response.json();
  if (data.success) {
    return { success: true };
  }
  const errorCode = data['error-codes']?.[0] || '不明なエラー';
  return { success: false, error: `認証に失敗しました (${errorCode})。` };
}

async function handleContact(request, env) {
  try {
    const body = await request.json();

    const name = body.name || '匿名';
    const email = body.email || '不明';
    const message = body.message || '';
    const token = body['cf-turnstile-response'] || body.turnstile || '';

    if (!token) {
      return Response.json({ success: false, error: 'Turnstile token missing' }, { status: 400 });
    }

    const verification = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY);

    if (!verification || !verification.success) {
      return Response.json({ success: false, error: verification?.error || 'Turnstile verification failed' }, { status: 401 });
    }

    const webhookUrl = env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL is not set');
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const payload = {
      embeds: [
        {
          title: 'New contact from portfolio',
          color: 5814783,
          fields: [
            { name: 'Name', value: name, inline: true },
            { name: 'Email', value: email, inline: true },
            { name: 'Message', value: message || '（空）' },
          ],
          footer: { text: 'portfolio contact form' },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Discord webhook error', await res.text());
      return Response.json({ success: false, error: 'Failed to send webhook' }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Error in /api/contact', err);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/contact') {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
