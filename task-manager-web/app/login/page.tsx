"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface ErrorResponse {
    message?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const redirectTo = searchParams.get('from') ?? '/tasks';
    const isDisabled = !email.trim() || !password.trim() || isLoading;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const body = (await response.json()) as ErrorResponse;
                setError(body.message ?? 'Login failed');
                return;
            }

            router.push(redirectTo);
        } catch (err) {
            console.error(err);
            setError('Server unavailable');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-50">
            <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.18),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.18),transparent_30%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.15),transparent_32%)]" />
            </div>

            <div className="relative flex min-h-screen w-full items-center px-5 py-12 sm:px-10 lg:px-16">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3 lg:max-w-xl">
                        <p className="text-lg font-bold uppercase tracking-[0.25em] text-indigo-100 sm:text-xl">
                            TASK MANAGER
                        </p>
                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                            Sign in and manage tasks efficiently
                        </h1>
                        <p className="text-sm text-indigo-100/70">
                            Fast and secure access to your workspace.
                        </p>
                    </div>

                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
                        <div className="mb-6 space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100/80">
                                Sign in
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-indigo-100">Email</label>
                                <input
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-indigo-50 placeholder:text-indigo-100/50 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-0"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-indigo-100">Password</label>
                                <input
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-indigo-50 placeholder:text-indigo-100/50 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-0"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Enter password"
                                />
                            </div>

                            {error ? (
                                <p className="text-sm text-rose-200">{error}</p>
                            ) : (
                                <p className="text-sm text-indigo-100/70">
                                    Data is sent over a secure connection.
                                </p>
                            )}

                            <button
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-400 px-4 font-semibold text-slate-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                disabled={isDisabled}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                        Loading...
                                    </span>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 space-y-2 text-sm text-indigo-100/80">
                            <div>
                                No account?{' '}
                                <Link href="/register" className="font-semibold text-indigo-100">
                                    Sign up
                                </Link>
                            </div>
                            <div>
                                Forgot password?{' '}
                                <Link href="/reset" className="font-semibold text-indigo-100">
                                    Recover access
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
