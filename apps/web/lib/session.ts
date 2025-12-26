import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.COOKIE_NAME ?? 'tm_token';
export const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export async function setTokenCookie(token: string, maxAgeSeconds?: number): Promise<void> {
    const store = await cookies();
    const baseOptions = {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    };

    if (typeof maxAgeSeconds === 'number') {
        store.set(COOKIE_NAME, token, { ...baseOptions, maxAge: maxAgeSeconds });
        return;
    }

    store.set(COOKIE_NAME, token, baseOptions);
}

export async function clearTokenCookie(): Promise<void> {
    const store = await cookies();
    store.delete(COOKIE_NAME);
}

export async function getTokenFromCookie(): Promise<string | null> {
    const store = await cookies();
    const cookie = store.get(COOKIE_NAME);
    return cookie?.value ?? null;
}

