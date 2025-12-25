import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/session';

export async function POST() {
    await clearTokenCookie();
    return NextResponse.json({ success: true });
}

