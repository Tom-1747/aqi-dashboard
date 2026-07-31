"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md rounded-md border border-border-strong bg-surface-raised p-6 shadow-glow">
        <p className="font-mono text-xs uppercase tracking-widest text-aqi4">
          Connexion à l&apos;entrepôt Neon impossible
        </p>
        <h1 className="mt-2 font-display text-lg font-semibold text-ink">
          Le dashboard n&apos;a pas pu lire les données.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Vérifie dans l&apos;ordre :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-muted">
          <li>
            que <code className="rounded-sm bg-bg px-1 py-0.5 font-mono text-xs text-ink">.env.local</code>{" "}
            contient bien <code className="rounded-sm bg-bg px-1 py-0.5 font-mono text-xs text-ink">DATABASE_URL</code>
          </li>
          <li>que le projet Neon n&apos;est pas suspendu ou supprimé</li>
          <li>que ta machine a bien accès au réseau (voir README, section Dépannage)</li>
        </ul>
        <button
          onClick={reset}
          className="mt-5 rounded-sm bg-pine px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
