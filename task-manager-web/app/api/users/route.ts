import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { getTokenFromCookie } from '@/lib/session';
import type { User } from '@/types/user';

export async function GET() {
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
    }

    const { data, status } = await backendFetch<User[]>(
        '/api/users',
        { method: 'GET' },
        token
    );

    return NextResponse.json(data ?? [], { status });
}

