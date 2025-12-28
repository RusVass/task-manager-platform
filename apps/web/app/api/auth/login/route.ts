import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { clearTokenCookie, ONE_WEEK_SECONDS, setTokenCookie } from '@/lib/session';
import type { User } from '@/types/user';

interface LoginBody {
    idToken?: string;
    email?: string;
    password?: string;
    rememberMe?: boolean;
}

interface LoginResponse {
    token?: string;
    user: User;
    message?: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginBody;

        // Firebase ID Token шлях (Google)
        if (body.idToken) {
            const { data, status } = await backendFetch<LoginResponse>(
                '/api/auth/profile',
                { method: 'GET' },
                body.idToken
            );

            if (status >= 200 && status < 300 && data?.user) {
                await setTokenCookie(body.idToken);
                return NextResponse.json({ user: data.user });
            }

            await clearTokenCookie();
            return NextResponse.json(
                { message: data?.message ?? 'Failed to sign in' },
                { status }
            );
        }

        // Локальний email/password шлях
        if (!body.email || !body.password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const rememberMe = Boolean(body.rememberMe);
        const { data, status } = await backendFetch<LoginResponse>(
            '/api/auth/login',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: body.email,
                    password: body.password,
                }),
            }
        );

        if (status >= 200 && status < 300 && data?.token && data?.user) {
            await setTokenCookie(data.token, rememberMe ? ONE_WEEK_SECONDS : undefined);
            return NextResponse.json({ user: data.user });
        }

        await clearTokenCookie();
        return NextResponse.json(
            { message: data?.message ?? 'Failed to sign in' },
            { status }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

