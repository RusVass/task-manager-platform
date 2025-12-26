"use client";

import { useRouter } from 'next/navigation';
import {
    useMemo,
    useState,
    useTransition,
    type FormEvent as ReactFormEvent,
    type MouseEvent as ReactMouseEvent,
} from 'react';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';

interface TaskCardProps {
    task: Task;
    owner?: Pick<User, '_id' | 'username' | 'email'>;
    canEdit?: boolean;
    hideActions?: boolean;
}

type TaskState = 'completed' | 'overdue' | 'in-progress';

interface StatusMeta {
    state: TaskState;
    label: string;
    actionLabel: 'Mark todo' | 'Complete' | 'Resolve';
    nextCompleted: boolean;
    dotClass: string;
    badgeClass: string;
}

export function TaskCard({ task, owner, canEdit = true, hideActions = false }: TaskCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.description ?? '');
    const [showDetails, setShowDetails] = useState(false);
    const [isPending, startTransition] = useTransition();

    const apiBase = '/api/tasks';

    const withRefresh = (fn: () => Promise<void>) => {
        startTransition(async () => {
            await fn();
            router.refresh();
        });
    };

    const ownerLabel = owner ? `${owner.username} (${owner.email})` : task.createBy;

    const dueDate = useMemo(() => {
        if (!task.dueDate) return null;
        const parsed = new Date(task.dueDate);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }, [task.dueDate]);

    const formattedDueDate = useMemo(() => {
        if (!dueDate) return 'No date';
        return dueDate.toISOString().slice(0, 10);
    }, [dueDate]);

    const statusMeta: StatusMeta = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isOverdue = !task.completed && dueDate !== null && dueDate < today;

        if (task.completed) {
            return {
                state: 'completed',
                label: 'Completed',
                actionLabel: 'Mark todo',
                nextCompleted: false,
                dotClass: 'bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.45)]',
                badgeClass: 'text-emerald-200 bg-emerald-400/10 border-emerald-200/20',
            };
        }

        if (isOverdue) {
            return {
                state: 'overdue',
                label: 'Overdue',
                actionLabel: 'Resolve',
                nextCompleted: true,
                dotClass: 'bg-rose-400 shadow-[0_0_16px_rgba(248,113,113,0.45)]',
                badgeClass: 'text-rose-200 bg-rose-400/10 border-rose-200/25',
            };
        }

        return {
            state: 'in-progress',
            label: 'In progress',
            actionLabel: 'Complete',
            nextCompleted: true,
            dotClass: 'bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.45)]',
            badgeClass: 'text-amber-100 bg-amber-300/10 border-amber-100/25',
        };
    }, [dueDate, task.completed]);

    const handleStatusChange = () =>
        withRefresh(async () => {
            await fetch(`${apiBase}/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: statusMeta.nextCompleted }),
            });
        });

    const handleDelete = () =>
        withRefresh(async () => {
            await fetch(`${apiBase}/${task._id}`, { method: 'DELETE' });
        });

    const handleEditSubmit = (event: ReactFormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const description = editValue.trim();
        if (!description) return;

        withRefresh(async () => {
            await fetch(`${apiBase}/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });
            setIsEditing(false);
        });
    };

    const handleAction = (fn: () => void) => (event: ReactMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        fn();
    };

    return (
        <>
            <div
                className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-indigo-50 shadow-2xl backdrop-blur transition hover:border-white/20"
                onClick={() => setShowDetails(true)}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 shadow-inner shadow-slate-950/40">
                    <span
                        aria-hidden
                        className={`h-3.5 w-3.5 rounded-full ${statusMeta.dotClass}`}
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-semibold leading-tight">
                            {task.title ?? task.description ?? 'Untitled'}
                        </p>
                        <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusMeta.badgeClass}`}
                        >
                            {statusMeta.label}
                        </span>
                    </div>
                    <p className="text-sm text-indigo-100/80">Due: {formattedDueDate}</p>
                    <p className="line-clamp-1 text-xs text-indigo-100/70">
                        {task.description?.trim() || 'No description'}
                    </p>
                </div>

                {!hideActions && canEdit ? (
                    <div className="flex items-center gap-2">
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-100 ring-1 ring-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
                            type="button"
                            onClick={handleAction(handleStatusChange)}
                            disabled={isPending}
                            aria-label={statusMeta.actionLabel}
                        >
                            {statusMeta.state === 'completed' ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    className="h-4.5 w-4.5 text-slate-100"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5.25 3.75 12 9 18.75M20.25 12H4"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    className="h-4.5 w-4.5 text-slate-100"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            )}
                        </button>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-100 ring-1 ring-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
                            type="button"
                            onClick={handleAction(() => {
                                setEditValue(task.description ?? '');
                                setIsEditing(true);
                            })}
                            disabled={isPending}
                            aria-label="Edit task"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-4.5 w-4.5 text-slate-100"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.954 18.335a4.2 4.2 0 0 1-1.767 1.05l-2.4.686.686-2.4a4.2 4.2 0 0 1 1.05-1.767L16.862 4.487Z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 2.97 2.97" />
                            </svg>
                        </button>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-100 ring-1 ring-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
                            type="button"
                            onClick={handleAction(handleDelete)}
                            disabled={isPending}
                            aria-label="Delete task"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                className="h-4.5 w-4.5 text-slate-100"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 7.5h10.5M9.75 7.5v-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1.5m-7.5 0V18a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V7.5m-7.5 0h7.5"
                                />
                            </svg>
                        </button>
                    </div>
                ) : null}
            </div>

            {isEditing ? (
                <form
                    className="mt-3 flex w-full flex-col gap-2 rounded-2xl border border-white/15 bg-slate-900/70 p-3 shadow-inner shadow-slate-950/30 sm:flex-row sm:items-center"
                    onSubmit={handleEditSubmit}
                    onClick={(event) => event.stopPropagation()}
                >
                    <input
                        className="h-11 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-slate-100 placeholder:text-slate-300/70 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40"
                        value={editValue}
                        onChange={(event) => setEditValue(event.target.value)}
                        placeholder="Task description"
                    />
                    <div className="flex gap-2">
                        <button
                            className="rounded-xl bg-indigo-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={isPending}
                        >
                            Save
                        </button>
                        <button
                            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/15 transition hover:bg-white/20"
                            type="button"
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : null}

            {showDetails ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur">
                    <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-800/85 p-6 text-slate-50 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/80">
                                    Task details
                                </p>
                                <h2 className="text-2xl font-bold text-slate-50">
                                    {task.title ?? 'Untitled'}
                                </h2>
                                <div className="flex flex-wrap gap-3 text-sm text-slate-200/80">
                                    <span>Status: {statusMeta.label}</span>
                                    <span>User: {ownerLabel}</span>
                                    <span>Due: {formattedDueDate}</span>
                                </div>
                            </div>
                            <button
                                className="rounded-xl bg-indigo-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-indigo-300"
                                type="button"
                                onClick={() => setShowDetails(false)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 text-slate-50">
                            <p className="text-sm text-slate-200/80">Details</p>
                            <p className="whitespace-pre-line break-words rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white">
                                {task.description?.trim() ? task.description : 'No description.'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

