'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ErrorResponse {
    message?: string;
}

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
                setError(body.message ?? 'Не вдалося створити акаунт');
                return;
            }

            router.push('/login');
        } catch (err) {
            console.error(err);
            setError('Сервер недоступний');
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
                <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-6">
                        <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
                            Task Manager
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                                Створіть акаунт і керуйте задачами безпечно
                            </h1>
                            <p className="text-lg text-indigo-100/80">
                                Відразу реєструйтесь на головній і працюйте з командами через
                                захищений проксі до бекенду.
                            </p>
                        </div>
                    </div>

                    <div className="justify-self-end">
                        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
                            <div className="mb-6 space-y-2">
                                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100/80">
                                    Реєстрація
                                </p>
                                <p className="text-lg text-indigo-50/90">
                                    Заповніть форму і переходьте до задач за кілька секунд.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-indigo-100">
                                        Ім&apos;я
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-indigo-50 placeholder:text-indigo-100/50 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Введіть ім’я"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-indigo-100">
                                        Email
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-indigo-50 placeholder:text-indigo-100/50 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-indigo-100">
                                        Пароль
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-indigo-50 placeholder:text-indigo-100/50 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        minLength={6}
                                        placeholder="Не менше 6 символів"
                                    />
                                </div>

                                {error ? (
                                    <p className="text-sm text-rose-200">{error}</p>
                                ) : null}

                                <button
                                    className="flex w-full items-center justify-center rounded-xl bg-indigo-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Реєстрація...' : 'Створити акаунт'}
                                </button>
                            </form>

                            <div className="mt-6 text-sm text-indigo-100/80">
                                Вже є акаунт?{' '}
                                <Link href="/login" className="font-semibold text-indigo-100">
                                    Увійти
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
