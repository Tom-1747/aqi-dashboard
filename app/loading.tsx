export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="h-2 w-2 animate-pulse rounded-full bg-pine" />
        Chargement des données de qualité de l&apos;air…
      </div>
    </div>
  );
}
