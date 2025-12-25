import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import type { User } from '@/types/user';

interface RegisterBody {
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

        if (!body.username || !body.email || !body.password) {
            return NextResponse.json(
                { message: 'Усі поля обовʼязкові' },
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

        if (status >= 200 && status < 300) {
            return NextResponse.json(data ?? {});
        }

        return NextResponse.json(
            { message: data?.message ?? 'Не вдалося зареєструватися' },
            { status }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Серверна помилка' }, { status: 500 });
    }
}

