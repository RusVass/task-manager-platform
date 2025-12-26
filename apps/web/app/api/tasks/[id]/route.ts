import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { getTokenFromCookie } from '@/lib/session';
import type { Task } from '@/types/task';

interface UpdateTaskBody {
    description?: string;
    completed?: boolean;
}

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data, status } = await backendFetch<Task>(
        `/api/tasks/${params.id}`,
        { method: 'GET' },
        token
    );

    return NextResponse.json(data ?? { message: 'Failed to fetch task' }, { status });
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as UpdateTaskBody;

    if (typeof body.description === 'undefined' && typeof body.completed === 'undefined') {
        return NextResponse.json(
            { message: 'No fields to update' },
            { status: 400 }
        );
    }

    const { data, status } = await backendFetch<Task>(
        `/api/tasks/${params.id}`,
        {
            method: 'PUT',
            body: JSON.stringify(body),
        },
        token
    );

    return NextResponse.json(data ?? { message: 'Failed to update task' }, { status });
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data, status } = await backendFetch<{ message?: string }>(
        `/api/tasks/${params.id}`,
        { method: 'DELETE' },
        token
    );

    return NextResponse.json(data ?? { message: 'Failed to delete task' }, { status });
}

