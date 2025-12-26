import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';
import { getTokenFromCookie } from '@/lib/session';
import type { User } from '@/types/user';

interface ProfileResponse {
    user: User;
    message?: string;
}

export async function GET() {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { data, status } = await backendFetch<ProfileResponse>(
            '/api/auth/profile',
            { method: 'GET' },
            token
        );

        if (status >= 200 && status < 300 && data?.user) {
            return NextResponse.json(data);
        }

        return NextResponse.json(
            { message: data?.message ?? 'Failed to fetch profile' },
            { status }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

