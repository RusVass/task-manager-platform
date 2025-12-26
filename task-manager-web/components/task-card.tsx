"use client";

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';

interface TaskCardProps {
    task: Task;
    owner?: Pick<User, '_id' | 'username' | 'email'>;
    canEdit?: boolean;
    hideActions?: boolean;
}

export function TaskCard({ task, owner, canEdit = true, hideActions = false }: TaskCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [isPending, startTransition] = useTransition();

    const apiBase = '/api/tasks';

    const withRefresh = (fn: () => Promise<void>) => {
        startTransition(async () => {
            await fn();
            router.refresh();
        });
    };

    const handleEdit = (formData: FormData) =>
        withRefresh(async () => {
            const description = (formData.get('description') ?? '').toString().trim();
            if (!description) return;

            await fetch(`${apiBase}/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });
            setIsEditing(false);
        });

    const handleToggle = () =>
        withRefresh(async () => {
            await fetch(`${apiBase}/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed }),
            });
        });

    const handleDelete = () =>
        withRefresh(async () => {
            await fetch(`${apiBase}/${task._id}`, {
                method: 'DELETE',
            });
        });

    const handleAction = (fn: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        fn();
    };

    const ownerLabel = owner ? `${owner.username} (${owner.email})` : task.createBy;

    const formattedDueDate =
        task.dueDate &&
        new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

    return (
        <>
            <div
                className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 pt-12 text-indigo-50 shadow-2xl backdrop-blur break-words cursor-pointer"
                onClick={() => setShowDetails(true)}
            >
                <div className="space-y-1">
                    <p className="text-lg font-semibold leading-tight break-words">
                        {task.title ?? task.description ?? 'Untitled'}
                    </p>
                    {formattedDueDate ? (
                        <p className="text-sm text-indigo-100/80">Due: {formattedDueDate}</p>
                    ) : null}
                    <p className="text-sm text-indigo-100/80">User: {ownerLabel}</p>
                    <p className="text-xs text-indigo-100/70">Click to view details</p>
                </div>

                {isEditing && canEdit ? (
                    <form
                        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        action={handleEdit}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            className="input w-full sm:max-w-xl text-slate-900 placeholder:text-slate-600"
                            name="description"
                            defaultValue={task.description}
                            placeholder="Task description"
                        />
                        <div className="flex gap-2 sm:justify-end">
                            <button
                                className="button secondary"
                                type="submit"
                                disabled={isPending}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Save
                            </button>
                            <button
                                className="button secondary"
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(false);
                                }}
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : !hideActions && canEdit ? (
                    <div className="absolute right-4 top-4 flex flex-wrap gap-2">
                        <button
                            className="rounded-xl bg-[#525866] px-3 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                            type="button"
                            onClick={handleAction(() => setIsEditing(true))}
                            disabled={isPending}
                            aria-label="Edit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-white transition hover:text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.954 18.335a4.2 4.2 0 0 1-1.767 1.05l-2.4.686.686-2.4a4.2 4.2 0 0 1 1.05-1.767L16.862 4.487ZM16.862 4.487l2.97 2.97" />
                            </svg>
                        </button>
                        <button
                            className="rounded-xl bg-[#525866] px-3 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                            type="button"
                            onClick={handleAction(handleToggle)}
                            disabled={isPending}
                            aria-label={task.completed ? 'Reopen' : 'Complete'}
                        >
                            {task.completed ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-white transition hover:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25 3.75 12 9 18.75M20.25 12H4" />
                                </svg>
                            ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-white transition hover:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            )}
                        </button>
                        <button
                            className="group rounded-xl bg-[#525866] px-3 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                            type="button"
                            onClick={handleAction(handleDelete)}
                            disabled={isPending}
                            aria-label="Delete"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-white transition group-hover:stroke-white group-hover:text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h10.5M9.75 7.5v-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1.5m-7.5 0V18a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V7.5m-7.5 0h7.5" />
                            </svg>
                        </button>
                    </div>
                ) : !hideActions ? (
                    <div className="absolute right-4 top-4 flex flex-wrap gap-2">
                        <button
                            className="rounded-xl bg-[#525866] px-3 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                            type="button"
                            onClick={handleAction(handleToggle)}
                            disabled={isPending}
                            aria-label={task.completed ? 'Reopen' : 'Complete'}
                        >
                            {task.completed ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-slate-800/70 transition hover:text-indigo-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25 3.75 12 9 18.75M20.25 12H4" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-slate-800/70 transition hover:text-indigo-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            )}
                        </button>
                        <button
                            className="group rounded-xl bg-[#525866] px-3 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                            type="button"
                            onClick={handleAction(handleDelete)}
                            disabled={isPending}
                            aria-label="Delete"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-slate-800/70 transition group-hover:stroke-white group-hover:text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h10.5M9.75 7.5v-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1.5m-7.5 0V18a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V7.5m-7.5 0h7.5" />
                            </svg>
                        </button>
                    </div>
                ) : null}
            </div>

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
                                    <span>Status: {task.completed ? 'Completed' : 'In progress'}</span>
                                    <span>User: {ownerLabel}</span>
                                    {formattedDueDate ? <span>Due: {formattedDueDate}</span> : null}
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

