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
        <section className="space-y-6">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">Задачі</p>
                    <h1 className="text-2xl font-semibold text-slate-900">Мої задачі</h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin" className="button secondary">
                        Адмін
                    </Link>
                    <form action={logout}>
                        <button className="button secondary" type="submit">
                            Вийти
                        </button>
                    </form>
                </div>
            </header>

            <form className="card space-y-4" action={createTask}>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Назва
                        </label>
                        <input
                            className="input"
                            name="title"
                            placeholder="Коротка назва"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Дедлайн (опційно)
                        </label>
                        <input className="input" type="date" name="dueDate" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                        Деталі
                    </label>
                    <textarea
                        className="input min-h-[96px]"
                        name="description"
                        placeholder="Що потрібно зробити?"
                    />
                </div>
                <button className="button w-full sm:w-auto" type="submit">
                    Додати задачу
                </button>
            </form>

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-slate-600">Поки немає задач.</p>
                ) : (
                    tasks.map((task) => <TaskCard key={task._id} task={task} />)
                )}
            </div>
        </section>
    );
}

