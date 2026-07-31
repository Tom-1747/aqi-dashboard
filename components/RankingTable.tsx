import { AQI_COLORS, AQI_LABELS, CITY_FLAGS } from "@/lib/constants";
import { formatDateHeure, formatNombre } from "@/lib/format";
import type { DerniereMesure } from "@/lib/types";

interface Props {
  mesures: DerniereMesure[];
}

export default function RankingTable({ mesures }: Props) {
  const triees = [...mesures].sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-strong bg-surface text-xs uppercase tracking-[0.12em] text-ink-faint">
              <th className="px-4 py-3 font-medium">Ville</th>
              <th className="px-4 py-3 font-medium">AQI</th>
              <th className="px-4 py-3 font-medium">PM2.5</th>
              <th className="px-4 py-3 font-medium">PM10</th>
              <th className="px-4 py-3 font-medium">NO₂</th>
              <th className="px-4 py-3 font-medium">O₃</th>
              <th className="px-4 py-3 font-medium">Dernière mesure</th>
            </tr>
          </thead>
          <tbody>
            {triees.map((m, i) => (
              <tr
                key={m.ville}
                className={`transition-colors hover:bg-surface-hover ${
                  i !== triees.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <span className="mr-1.5">{CITY_FLAGS[m.ville]}</span>
                  <span className="font-medium text-ink">{m.ville}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-xs font-semibold text-bg tabular"
                    style={{ backgroundColor: AQI_COLORS[m.aqi] }}
                  >
                    {m.aqi} · {AQI_LABELS[m.aqi]}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular text-ink">
                  {formatNombre(m.pm2_5)}
                </td>
                <td className="px-4 py-3 font-mono tabular text-ink">
                  {formatNombre(m.pm10)}
                </td>
                <td className="px-4 py-3 font-mono tabular text-ink">
                  {formatNombre(m.no2)}
                </td>
                <td className="px-4 py-3 font-mono tabular text-ink">
                  {formatNombre(m.o3)}
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {formatDateHeure(m.timestamp_utc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
