"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface ErrorResponse {
    message?: string;
}

const EMAIL_STORAGE_KEY = 'tm_login_emails';
const LAST_EMAIL_KEY = 'tm_login_last_email';
const REMEMBER_KEY = 'tm_login_remember';
const EMAIL_STORAGE_LIMIT = 5;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [storedEmails, setStoredEmails] = useState<string[]>([]);
    const [rememberMe, setRememberMe] = useState(false);

    const redirectTo = searchParams.get('from') ?? '/tasks';
    const isDisabled = !email.trim() || !password.trim() || isLoading;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedEmails = safeParseEmails(localStorage.getItem(EMAIL_STORAGE_KEY));
        setStoredEmails(savedEmails);

        const shouldRemember = localStorage.getItem(REMEMBER_KEY) === 'true';
        setRememberMe(shouldRemember);

        if (shouldRemember) {
            const lastEmail = localStorage.getItem(LAST_EMAIL_KEY);
            if (lastEmail) setEmail(lastEmail);
        }
    }, []);

    const persistEmail = (value: string) => {
        if (typeof window === 'undefined') return;

        const normalized = value.trim();
        if (!normalized) return;

        setStoredEmails((prev) => {
            const next = Array.from(new Set([normalized, ...prev])).slice(0, EMAIL_STORAGE_LIMIT);
            localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(next));
            return next;
        });

        if (rememberMe) {
            localStorage.setItem(LAST_EMAIL_KEY, normalized);
            localStorage.setItem(REMEMBER_KEY, 'true');
        }
    };

    const handleRememberChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (typeof window === 'undefined') return;

        const checked = event.target.checked;
        setRememberMe(checked);

        if (!checked) {
            localStorage.removeItem(REMEMBER_KEY);
            localStorage.removeItem(LAST_EMAIL_KEY);
            return;
        }

        localStorage.setItem(REMEMBER_KEY, 'true');
        if (email.trim()) {
            localStorage.setItem(LAST_EMAIL_KEY, email.trim());
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
                const body = (await response.json()) as ErrorResponse;
                setError(body.message ?? 'Login failed');
                return;
            }

            persistEmail(email);
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
                                    list="email-suggestions"
                                />
                                <datalist id="email-suggestions">
                                    {storedEmails.map((item) => (
                                        <option key={item} value={item} />
                                    ))}
                                </datalist>
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

                            <div className="flex items-center justify-between text-sm text-indigo-100/80">
                                <label className="flex items-center gap-2">
                                    <input
                                        className="h-4 w-4 rounded border border-white/30 bg-white/10 text-indigo-400 focus:ring-indigo-300/60"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={handleRememberChange}
                                        aria-label="Remember me"
                                    />
                                    Remember me
                                </label>
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

function safeParseEmails(raw: string | null): string[] {
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, EMAIL_STORAGE_LIMIT);
    } catch {
        return [];
    }
}
