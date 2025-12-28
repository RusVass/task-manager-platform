import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { setTokenCookie } from '@/lib/session';
import type { User } from '@/types/user';

interface RegisterBody {
    idToken?: string;
    username?: string;
    email?: string;
    password?: string;
}

interface RegisterResponse {
    token?: string;
    user?: User;
    message?: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RegisterBody;

        // Firebase шлях (Google)
        if (body.idToken) {
            const { data, status } = await backendFetch<RegisterResponse>(
                '/api/auth/profile',
                { method: 'GET' },
                body.idToken
            );

            if (status >= 200 && status < 300 && data?.user) {
                await setTokenCookie(body.idToken);
                return NextResponse.json(data ?? {});
            }

            return NextResponse.json(
                { message: data?.message ?? 'Failed to sign up' },
                { status }
            );
        }

        // Локальний email/password шлях
        if (!body.username || !body.email || !body.password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        const { data, status } = await backendFetch<RegisterResponse>(
            '/api/auth/register',
            {
                method: 'POST',
                body: JSON.stringify({
                    username: body.username,
                    email: body.email,
                    password: body.password,
                }),
            }
        );

        if (status >= 200 && status < 300 && data?.token && data.user) {
            await setTokenCookie(data.token);
            return NextResponse.json({ user: data.user });
        }

        return NextResponse.json(
            { message: data?.message ?? 'Failed to sign up' },
            { status }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

