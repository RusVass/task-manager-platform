import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';
import { TaskCard } from '@/components/task-card';
import { UsersList } from '@/components/users-list';

const appBaseUrl =
    process.env.VERCEL_URL !== undefined
        ? `https://${process.env.VERCEL_URL}`
        : process.env.APP_BASE_URL ?? 'http://localhost:3000';

function apiUrl(path: string) {
    return `${appBaseUrl}${path}`;
}

async function buildRequestInit(init?: RequestInit): Promise<RequestInit> {
    const cookieStore = await cookies();
    const headers = new Headers(init?.headers ?? {});

    const serialized = cookieStore
        .getAll()
        .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
        .join('; ');

    if (serialized) {
        headers.set('cookie', serialized);
    }

    return {
        ...init,
        headers,
        cache: 'no-store',
    };
}

async function fetchAdminTasks(): Promise<Task[]> {
    const response = await fetch(apiUrl('/api/tasks'), await buildRequestInit());

    if (response.status === 401) {
        redirect('/login');
    }

    if (response.status === 403) {
        redirect('/tasks');
    }

    if (!response.ok) {
        console.error('Failed to load admin tasks');
        return [];
    }

    return ((await response.json()) as Task[]) ?? [];
}

async function fetchUsers(): Promise<User[]> {
    const response = await fetch(apiUrl('/api/users'), await buildRequestInit());

    if (response.status === 401) {
        redirect('/login');
    }

    if (response.status === 403) {
        redirect('/tasks');
    }

    if (!response.ok) {
        console.error('Failed to load users');
        return [];
    }

    return ((await response.json()) as User[]) ?? [];
}

async function logout() {
    'use server';

    await fetch(
        apiUrl('/api/auth/logout'),
        await buildRequestInit({
            method: 'POST',
        })
    );

    redirect('/login');
}

export default async function AdminPage() {
    const [tasks, users] = await Promise.all([fetchAdminTasks(), fetchUsers()]);

    return (
        <section className="space-y-6">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">Адмін</p>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Всі задачі користувачів
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/tasks" className="button secondary">
                        Мої задачі
                    </Link>
                    <form action={logout}>
                        <button className="button secondary" type="submit">
                            Вийти
                        </button>
                    </form>
                </div>
            </header>

            <div className="flex flex-wrap gap-2">
                <Link href="/admin" className="button secondary !bg-slate-900 !text-white">
                    Всі
                </Link>
                <Link href="/tasks" className="button secondary">
                    Мої (CRUD)
                </Link>
            </div>

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-slate-600">Задач поки немає.</p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            canEdit
                        />
                    ))
                )}
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">Користувачі</h2>
                <UsersList users={users} />
            </div>
        </section>
    );
}

