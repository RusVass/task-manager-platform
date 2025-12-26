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
                setError(body.message ?? 'Failed to update user');
                return;
            }

            await router.refresh();
        } catch (err) {
            console.error(err);
            setError('Server unavailable');
        } finally {
            setPendingId(null);
        }
    };

    if (users.length === 0) {
        return <p className="text-slate-600">No users yet.</p>;
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
                            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-indigo-50 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-indigo-50">{user.username}</p>
                                <p className="text-sm text-indigo-100/80">{user.email}</p>
                                <p className="text-xs text-indigo-100/70">
                                    Role: {user.role} • Status: {user.blocked ? 'Blocked' : 'Active'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="group flex items-center gap-2 rounded-xl bg-[#525866] px-4 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => toggleBlock(user._id, false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="h-5 w-5 text-white transition group-hover:text-white"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 10.5V8.25a3.75 3.75 0 0 1 7.5 0V9M6.75 10.5h10.5v6A2.25 2.25 0 0 1 15 18.75h-6A2.25 2.25 0 0 1 6.75 16.5v-6Z"
                                        />
                                    </svg>
                                    {isPending ? '...' : 'Unblock'}
                                </button>
                                <button
                                    className="group flex items-center gap-2 rounded-xl bg-[#525866] px-4 py-2 text-white shadow-sm transition hover:bg-[#5d6474]"
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => toggleBlock(user._id, true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="h-5 w-5 text-white transition group-hover:text-white"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V8.25a4.5 4.5 0 0 0-9 0v2.25M6.75 10.5h10.5v6A2.25 2.25 0 0 1 15 18.75h-6A2.25 2.25 0 0 1 6.75 16.5v-6Z"
                                        />
                                    </svg>
                                    {isPending ? '...' : 'Block'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

