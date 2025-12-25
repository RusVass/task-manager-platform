import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { clearTokenCookie, setTokenCookie } from '@/lib/session';
import type { User } from '@/types/user';

interface LoginBody {
    email?: string;
    password?: string;
}

interface LoginResponse {
    token: string;
    user: User;
    message?: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginBody;

        if (!body.email || !body.password) {
            return NextResponse.json(
                { message: 'Email та пароль обовʼязкові' },
                { status: 400 }
            );
        }

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

        if (status >= 200 && status < 300 && data?.token) {
            await setTokenCookie(data.token);
            return NextResponse.json({ user: data.user });
        }

        await clearTokenCookie();
        return NextResponse.json(
            { message: data?.message ?? 'Не вдалося увійти' },
            { status }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Серверна помилка' }, { status: 500 });
    }
}

