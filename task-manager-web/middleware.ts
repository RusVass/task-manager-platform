import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME ?? 'tm_token';

async function fetchCurrentUser(request: NextRequest) {
    const meUrl = new URL('/api/auth/profile', request.nextUrl.origin);

    const response = await fetch(meUrl, {
        headers: {
            cookie: request.headers.get('cookie') ?? '',
        },
    });

    if (!response.ok) {
        return null;
    }

    const result = (await response.json()) as { user?: { role?: string } };
    return result.user ?? null;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = pathname.startsWith('/tasks') || pathname.startsWith('/admin');

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/admin')) {
        const user = await fetchCurrentUser(request);

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (user.role !== 'admin') {
            return NextResponse.redirect(new URL('/tasks', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/tasks/:path*', '/admin/:path*'],
};

