interface Props {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
  hint?: string;
}

export default function KpiCard({ label, value, unit, accent, hint }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-surface-raised p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover">
      {accent && (
        <span
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ backgroundColor: accent }}
        />
      )}
      <div className="flex items-center gap-2">
        {accent && (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
        )}
        <p className="truncate text-xs uppercase tracking-wide text-ink-faint">
          {label}
        </p>
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular text-ink sm:text-[1.65rem]">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-ink-muted">
            {unit}
          </span>
        )}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
