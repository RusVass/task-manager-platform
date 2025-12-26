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
    const usersById = new Map(users.map((user) => [user._id, user]));

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-50">
            <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.18),transparent_30%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.15),transparent_32%)]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-5 py-12 sm:px-10 lg:px-16">
                <header className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100/80">
                            Admin
                        </p>
                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                            All user tasks
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/tasks"
                            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-white/20"
                        >
                            My tasks
                        </Link>
                        <form action={logout}>
                            <button
                                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-white/20"
                                type="submit"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </header>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="space-y-3">
                        {tasks.length === 0 ? (
                            <p className="text-indigo-100/80">No tasks yet.</p>
                        ) : (
                            tasks.map((task) => {
                                const owner = usersById.get(task.createBy);
                                return (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        owner={owner}
                                        canEdit
                                        hideActions
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-indigo-50">Users</h2>
                    </div>
                    <UsersList users={users} />
                </div>
            </div>
        </div>
    );
}

