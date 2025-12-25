"use client";

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Task } from '@/types/task';

interface TaskCardProps {
    task: Task;
    canEdit?: boolean;
}

export function TaskCard({ task, canEdit = true }: TaskCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
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

    return (
        <div className="card flex flex-col gap-3">
            <div className="space-y-1">
                <p className="text-lg font-semibold text-slate-900">
                    {task.title ?? task.description}
                </p>
                {task.description &&
                    (!task.title || task.title.trim() !== task.description.trim()) && (
                        <p className="whitespace-pre-line text-sm text-slate-700">
                            {task.description}
                        </p>
                    )}
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>Статус: {task.completed ? 'Виконано' : 'В процесі'}</span>
                    {task.dueDate ? (
                        <span className="text-slate-500">
                            Дедлайн:{' '}
                            {new Date(task.dueDate).toLocaleDateString('uk-UA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}
                        </span>
                    ) : null}
                </div>
            </div>

            {isEditing && canEdit ? (
                <form
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    action={handleEdit}
                >
                    <input
                        className="input w-full sm:max-w-xl"
                        name="description"
                        defaultValue={task.description}
                        placeholder="Опис задачі"
                    />
                    <div className="flex gap-2 sm:justify-end">
                        <button className="button secondary" type="submit" disabled={isPending}>
                            Зберегти
                        </button>
                        <button
                            className="button secondary"
                            type="button"
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            ) : canEdit ? (
                <div className="flex flex-wrap gap-2">
                    <button
                        className="button secondary"
                        type="button"
                        onClick={() => setIsEditing(true)}
                        disabled={isPending}
                    >
                        Оновити
                    </button>
                    <button
                        className="button secondary"
                        type="button"
                        onClick={handleToggle}
                        disabled={isPending}
                    >
                        {task.completed ? 'Повернути' : 'Завершити'}
                    </button>
                    <button
                        className="button danger"
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        Видалити
                    </button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <button
                        className="button secondary"
                        type="button"
                        onClick={handleToggle}
                        disabled={isPending}
                    >
                        {task.completed ? 'Повернути' : 'Завершити'}
                    </button>
                    <button
                        className="button danger"
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        Видалити
                    </button>
                </div>
            )}
        </div>
    );
}

