const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not configured');
}

export interface BackendResponse<T> {
    data: T | null;
    status: number;
}

export async function backendFetch<T>(
    path: string,
    options: RequestInit = {},
    token?: string
): Promise<BackendResponse<T>> {
    const url = `${BACKEND_URL}${path}`;
    const headers = new Headers(options.headers ?? {});

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : null;

    return { data, status: response.status };
}

