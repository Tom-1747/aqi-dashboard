import { AQI_COLORS, AQI_LABELS } from "@/lib/constants";

export default function AqiLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border border-border bg-surface-raised px-3 py-2">
      {[1, 2, 3, 4, 5].map((aqi) => (
        <div key={aqi} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: AQI_COLORS[aqi] }}
          />
          <span className="font-mono text-[11px] text-ink-muted">
            {aqi} · {AQI_LABELS[aqi]}
          </span>
        </div>
      ))}
    </div>
  );
}
