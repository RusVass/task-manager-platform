import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { getTokenFromCookie } from '@/lib/session';
import type { User } from '@/types/user';

interface BlockBody {
    blocked?: boolean;
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const token = await getTokenFromCookie();

    if (!token) {
        return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
    }

    const body = (await request.json()) as BlockBody;

    const { data, status } = await backendFetch<User>(
        `/api/users/${params.id}/block`,
        {
            method: 'PATCH',
            body: JSON.stringify({ blocked: body.blocked }),
        },
        token
    );

    return NextResponse.json(
        data ?? { message: 'Не вдалося оновити користувача' },
        { status }
    );
}

