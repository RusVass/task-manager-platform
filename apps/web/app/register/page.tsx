"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ErrorResponse {
    message?: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isDisabled = !username.trim() || !email.trim() || !password.trim() || isLoading;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const body = (await response.json()) as ErrorResponse;
                setError(body.message ?? 'Failed to create account');
                return;
            }

            router.push('/login');
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
                    <div className="w-full max-w-2xl space-y-4">
                        <div className="space-y-2">
                            <p className="text-lg font-bold uppercase tracking-[0.25em] text-indigo-100 sm:text-xl">
                                TASK MANAGER
                            </p>
                            <p className="text-sm text-indigo-100/70">
                                Create your account and start managing tasks.
                            </p>
                        </div>
                        <div
                            className="grid gap-0"
                            style={{
                                gridTemplateColumns: '1fr 1fr',
                                gridTemplateAreas: '"wide1 tall2" "tall3 tall2" "tall3 wide4"',
                            }}
                        >
                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
                                style={{
                                    gridArea: 'wide1',
                                    aspectRatio: '16 / 9',
                                    transform: 'translate(20px, 150px) scale(0.9)',
                                    transformOrigin: 'center',
                                }}
                            >
                                <Image
                                    src="/2.jpg"
                                    alt="Strategic planning board"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
                                style={{
                                    gridArea: 'tall2',
                                    aspectRatio: '2 / 3',
                                    transform: 'translate(-30px, -11px) scale(0.7)',
                                    transformOrigin: 'center',
                                }}
                            >
                                <Image
                                    src="/1.jpg"
                                    alt="Project management sketch"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
                                style={{
                                    gridArea: 'tall3',
                                    aspectRatio: '2 / 3',
                                    transform: 'translate(44px, 88px) scale(0.7)',
                                    transformOrigin: 'center',
                                }}
                            >
                                <Image
                                    src="/4.jpg"
                                    alt="Team analytics workspace"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
                                style={{
                                    gridArea: 'wide4',
                                    aspectRatio: '16 / 9',
                                    transform: 'translate(-2px, -74px) scale(0.9)',
                                    transformOrigin: 'center',
                                }}
                            >
                                <Image
                                    src="/3.png"
                                    alt="Happy listening to music"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
                        <div className="mb-6 space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100/80">
                                Sign up
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-indigo-100">Name</label>
                                <input
                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-indigo-50 placeholder:text-indigo-100/50 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/40 focus:ring-offset-0"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Enter name"
                                />
                            </div>
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
                                    autoComplete="new-password"
                                    minLength={6}
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
                                        Creating...
                                    </span>
                                ) : (
                                    'Create account'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 space-y-2 text-sm text-indigo-100/80">
                            <div>
                                Already have an account?{' '}
                                <Link href="/login" className="font-semibold text-indigo-100">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

