import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { getTokenFromCookie } from '@/lib/session';
import type { Task } from '@/types/task';

export async function GET() {
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
    }

    const { data, status } = await backendFetch<Task[]>(
        '/api/task',
        { method: 'GET' },
        token
    );

    return NextResponse.json(data ?? [], { status });
}

