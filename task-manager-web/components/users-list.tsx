"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { User } from '@/types/user';

interface UsersListProps {
    users: User[];
}

export function UsersList({ users }: UsersListProps) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggleBlock = async (id: string, blocked: boolean) => {
        setError(null);
        setPendingId(id);

        try {
            const response = await fetch(`/api/users/${id}/block`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blocked }),
            });

            if (!response.ok) {
                const body = (await response.json().catch(() => ({}))) as { message?: string };
                setError(body.message ?? 'Не вдалося оновити користувача');
                return;
            }

            await router.refresh();
        } catch (err) {
            console.error(err);
            setError('Сервер недоступний');
        } finally {
            setPendingId(null);
        }
    };

    if (users.length === 0) {
        return <p className="text-slate-600">Користувачів поки немає.</p>;
    }

    return (
        <div className="space-y-4">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="space-y-3">
                {users.map((user) => {
                    const isPending = pendingId === user._id;
                    return (
                        <div
                            key={user._id}
                            className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900">{user.username}</p>
                                <p className="text-sm text-slate-600">{user.email}</p>
                                <p className="text-xs text-slate-500">
                                    Роль: {user.role} • Статус: {user.blocked ? 'Заблокований' : 'Активний'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="button secondary"
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => toggleBlock(user._id, false)}
                                >
                                    {isPending ? '...' : 'Розблокувати'}
                                </button>
                                <button
                                    className="button danger"
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => toggleBlock(user._id, true)}
                                >
                                    {isPending ? '...' : 'Заблокувати'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

