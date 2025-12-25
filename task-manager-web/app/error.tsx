"use client";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
    return (
        <div className="card space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Сталася помилка</h2>
            <p className="text-sm text-slate-700">
                {error.message || 'Невідома помилка. Спробуйте ще раз.'}
            </p>
            <button className="button secondary w-fit" onClick={reset}>
                Повторити
            </button>
        </div>
    );
}

