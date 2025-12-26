import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Task } from '@/types/task';
import { TaskCard } from '@/components/task-card';

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

async function fetchTasks(): Promise<Task[]> {
    const response = await fetch(apiUrl('/api/tasks/my'), await buildRequestInit());

    if (response.status === 401) {
        redirect('/login');
    }

    if (!response.ok) {
        console.error('Failed to load tasks');
        return [];
    }

    const tasks = (await response.json()) as Task[];
    return tasks ?? [];
}

async function createTask(formData: FormData) {
    'use server';

    const title = (formData.get('title') ?? '').toString().trim();
    const description = (formData.get('description') ?? '').toString().trim();
    const dueDate = (formData.get('dueDate') ?? '').toString().trim();

    const payload = {
        title: title || undefined,
        description: description || undefined,
        dueDate: dueDate || undefined,
    };

    const response = await fetch(
        apiUrl('/api/tasks/my'),
        await buildRequestInit({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
    );

    if (response.status === 401) {
        redirect('/login');
    }

    if (!response.ok) {
        console.error('Failed to create task');
        return;
    }

    revalidatePath('/tasks');
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

export default async function TasksPage() {
    const tasks = await fetchTasks();

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
                            Tasks
                        </p>
                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">My tasks</h1>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin"
                            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-white/20"
                        >
                            Admin
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
                    <form className="space-y-4" action={createTask}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-indigo-100">Title</label>
                                <input
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-indigo-50 placeholder:text-indigo-100/50 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-0"
                                    name="title"
                                    placeholder="Short title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-indigo-100">
                                    Due date (optional)
                                </label>
                                <input
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-indigo-50 placeholder:text-indigo-100/50 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-0 [color-scheme:dark] appearance-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:bg-no-repeat [&::-webkit-calendar-picker-indicator]:bg-center [&::-webkit-calendar-picker-indicator]:bg-contain [&::-webkit-calendar-picker-indicator]:[background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23fff%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%27M7 3a1 1 0 0 1 1 1v1h8V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm0 4H5v2h14V7h-2v1a1 1 0 1 1-2 0V7H9v1a1 1 0 0 1-2 0Zm12 4H5v7h14v-7Z%27/%3E%3C/svg%3E')] [&::-webkit-calendar-picker-indicator]:drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] [&::-webkit-calendar-picker-indicator:hover]:drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                                    type="date"
                                    name="dueDate"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                                <label className="block text-sm font-medium text-indigo-100">
                                    Details
                                </label>
                            <textarea
                                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-indigo-50 placeholder:text-indigo-100/50 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-0"
                                name="description"
                                placeholder="What needs to be done?"
                            />
                        </div>
                        <button
                            className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-400 px-4 font-semibold text-slate-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                            type="submit"
                        >
                            Add task
                        </button>
                    </form>
                </div>

                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <p className="text-indigo-100/80">No tasks yet.</p>
                    ) : (
                        tasks.map((task) => <TaskCard key={task._id} task={task} />)
                    )}
                    <p className="text-xs text-indigo-100/70">
                        Admin panel is available separately and shows all tasks and the user list.
                    </p>
                </div>
            </div>
        </div>
    );
}
