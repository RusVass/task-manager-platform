import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { getTokenFromCookie } from '@/lib/session';
import type { Task } from '@/types/task';

interface CreateTaskBody {
    title?: string;
    description?: string;
    dueDate?: string;
}

export async function GET() {
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
    }

    const { data, status } = await backendFetch<Task[]>(
        '/api/task/my',
        { method: 'GET' },
        token
    );

    return NextResponse.json(data ?? [], { status });
}

export async function POST(request: Request) {
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
    }

    const body = (await request.json()) as CreateTaskBody;
    const title = body.title?.trim();
    const description = body.description?.trim();
    const dueDate = body.dueDate?.trim();

    if (!title && !description) {
        return NextResponse.json(
            { message: 'Опишіть задачу або додайте назву' },
            { status: 400 }
        );
    }

    const payload = {
        title: title || undefined,
        description: description || title,
        dueDate: dueDate || undefined,
    };

    const { data, status } = await backendFetch<Task>(
        '/api/task',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        },
        token
    );

    return NextResponse.json(
        data ?? { message: 'Не вдалося створити задачу' },
        { status }
    );
}

