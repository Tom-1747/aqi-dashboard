"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  CITY_COLORS,
  POLLUTANT_LABELS,
  POLLUTANT_UNITS,
  POLLUTANTS,
  type Pollutant,
} from "@/lib/constants";
import { formatJourCourt } from "@/lib/format";
import type { PointSerieTemporelle } from "@/lib/types";

export default function TrendsSection() {
  const [pollutant, setPollutant] = useState<Pollutant>("aqi");
  const [points, setPoints] = useState<PointSerieTemporelle[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;
    setLoading(true);
    setErreur(null);

    fetch(`/api/timeseries?pollutant=${pollutant}`)
      .then((res) => {
        if (!res.ok) throw new Error("Réponse API invalide");
        return res.json();
      })
      .then((json) => {
        if (!annule) setPoints(json.data);
      })
      .catch(() => {
        if (!annule)
          setErreur(
            "Impossible de charger la série temporelle depuis Neon."
          );
      })
      .finally(() => {
        if (!annule) setLoading(false);
      });

    return () => {
      annule = true;
    };
  }, [pollutant]);

  const { data, villes } = useMemo(() => {
    const villesSet = new Set(points.map((p) => p.ville));
    const villes = Array.from(villesSet);

    const parJour = new Map<string, Record<string, number | string>>();
    for (const p of points) {
      const row = parJour.get(p.jour) ?? { jour: p.jour };
      row[p.ville] = p.valeur;
      parJour.set(p.jour, row);
    }

    const data = Array.from(parJour.values()).sort((a, b) =>
      String(a.jour).localeCompare(String(b.jour))
    );

    return { data, villes };
  }, [points]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            Tendances journalières
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Moyenne quotidienne par ville, sur toute la période collectée.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {POLLUTANTS.map((p) => (
            <button
              key={p}
              onClick={() => setPollutant(p)}
              className={`rounded-sm border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                pollutant === p
                  ? "border-pine bg-pine-glow text-pine"
                  : "border-border bg-surface-raised text-ink-muted hover:border-border-strong hover:text-ink"
              }`}
            >
              {POLLUTANT_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-raised p-4 shadow-card sm:p-5">
        {erreur && <p className="py-16 text-center text-sm text-aqi4">{erreur}</p>}
        {!erreur && loading && (
          <p className="py-16 text-center text-sm text-ink-faint">
            Chargement depuis Neon…
          </p>
        )}
        {!erreur && !loading && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#232B34" vertical={false} />
                <XAxis
                  dataKey="jour"
                  tickFormatter={formatJourCourt}
                  tick={{ fontSize: 11, fill: "#5F6A75" }}
                  tickLine={false}
                  axisLine={{ stroke: "#232B34" }}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#5F6A75" }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  label={{
                    value: POLLUTANT_UNITS[pollutant],
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#5F6A75" },
                  }}
                />
                <Tooltip
                  labelFormatter={(l) => formatJourCourt(String(l))}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    backgroundColor: "#161C24",
                    borderColor: "#2E3742",
                    color: "#E7EAED",
                  }}
                  labelStyle={{ color: "#9CA6B0" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9CA6B0" }} />
                {villes.map((v) => (
                  <Line
                    key={v}
                    type="monotone"
                    dataKey={v}
                    stroke={CITY_COLORS[v] ?? "#46C2A0"}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
