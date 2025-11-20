'use server';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(formData) {
    const token = formData.get('cf-turnstile-response');

    if (!token || typeof token !== 'string') {
        return { success: false, error: 'Turnstileトークンが見つかりません。' };
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
        console.error('SERVER CONFIG ERROR: TURNSTILE_SECRET_KEY is not set.');
        return { success: false, error: 'サーバー設定エラーが発生しました。' };
    }

    const body = new URLSearchParams({
        secret: secretKey,
        response: token,
    });

    try {
        const response = await fetch(VERIFY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const data = await response.json();

        if (data.success) {
            return { success: true };
        } else {
            console.error('Turnstile verification failed:', data['error-codes']);
            const errorCode = data['error-codes'] && data['error-codes'].length > 0 ? data['error-codes'][0] : '不明なエラー';
            return { success: false, error: `認証に失敗しました (${errorCode})。` };
        }
    } catch (err) {
        console.error('Fetch error during Turnstile verification:', err);
        return { success: false, error: 'ネットワークエラーが発生しました。' };
    }
}
