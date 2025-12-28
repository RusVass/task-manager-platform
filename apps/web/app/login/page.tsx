"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const redirectTo = searchParams.get('from') ?? '/tasks';
    const isDisabled = !email.trim() || !password.trim() || isLoading;

    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const credential = await signInWithPopup(auth, googleProvider);
            const idToken = await credential.user.getIdToken(true);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                const body = (await response.json()) as { message?: string };
                setError(body.message ?? 'Google sign-in failed');
                return;
            }

            router.push(redirectTo);
        } catch (err) {
            console.error(err);
            setError('Google sign-in failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            if (!response.ok) {
                const body = (await response.json()) as { message?: string };
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
                    <div className="w-full max-w-2xl space-y-4">
                        <div className="space-y-2">
                            <p className="text-lg font-bold uppercase tracking-[0.25em] text-indigo-100 sm:text-xl">
                                TASK MANAGER
                            </p>
                            <p className="text-sm text-indigo-100/70">
                                Sign in and manage tasks efficiently.
                            </p>
                        </div>
                        <div
                            className="hidden gap-0 lg:grid"
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
                                    transform: 'translate(20px, 112px) scale(0.9)',
                                    transformOrigin: 'center',
                                }}
                            >
                                <Image
                                    src="/1.jpg"
                                    alt="Portrait outside"
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
                                    src="/2.jpg"
                                    alt="Jumping celebration"
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
                                    transform: 'translate(44px, 48px) scale(0.7)',
                                    transformOrigin: 'center',
                                }}
                            >
                                <Image
                                    src="/4.jpg"
                                    alt="Kid smiling with ice cream"
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
                                Sign in with Google
                            </p>
                        </div>

                        <div className="space-y-4">
                            {error ? (
                                <p className="text-sm text-rose-200">{error}</p>
                            ) : (
                                <p className="text-sm text-indigo-100/70">
                                    Використовуйте Google, щоб увійти та отримати доступ до задач.
                                </p>
                            )}

                            <button
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-400 px-4 font-semibold text-slate-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                        Увійти...
                                    </span>
                                ) : (
                                    'Увійти через Google'
                                )}
                            </button>
                        </div>

                        <div className="my-6 h-px w-full bg-white/10" />

                        <div className="mb-4 space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100/80">
                                Sign in with Email
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
                            <div className="flex items-center gap-2 text-sm text-indigo-100/80">
                                <input
                                    className="h-4 w-4 rounded border border-white/30 bg-white/10 text-indigo-400 focus:ring-indigo-300/60"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    aria-label="Remember me"
                                />
                                Remember me
                            </div>
                            <button
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-400 px-4 font-semibold text-slate-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                disabled={isDisabled}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                        Входимо...
                                    </span>
                                ) : (
                                    'Увійти'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 space-y-2 text-sm text-indigo-100/80">
                            <div>
                                Немає акаунта?{' '}
                                <Link href="/register" className="font-semibold text-indigo-100">
                                    Зареєструватися
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
