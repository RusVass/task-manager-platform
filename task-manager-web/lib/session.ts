import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.COOKIE_NAME ?? 'tm_token';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export async function setTokenCookie(token: string): Promise<void> {
    const store = await cookies();

    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ONE_WEEK_SECONDS,
    });
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

