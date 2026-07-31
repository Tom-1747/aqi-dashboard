"use client";

import { useEffect, useMemo, useState } from "react";
import {
  JOURS_ORDRE,
  POLLUTANT_LABELS,
  POLLUTANTS,
  type Pollutant,
} from "@/lib/constants";
import { formatNombre } from "@/lib/format";
import type { PointHeatmap } from "@/lib/types";

interface Props {
  villes: string[];
}

function couleurIntensite(valeur: number, max: number): string {
  if (max <= 0) return "#171C24";
  const t = Math.min(1, valeur / max);
  // Interpole entre le fond de panneau (bas), un ambre (moyen) et un magenta
  // (haut) — cohérent avec la palette de sévérité AQI, en restant lisible
  // sur fond sombre (contrairement à un simple assombrissement qui finirait
  // invisible en haut d'échelle).
  const stops = [
    { t: 0, c: [23, 28, 36] },
    { t: 0.5, c: [227, 164, 85] },
    { t: 1, c: [200, 92, 147] },
  ];
  let a = stops[0];
  let b = stops[1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const localT = (t - a.t) / (b.t - a.t || 1);
  const rgb = a.c.map((v, i) => Math.round(v + (b.c[i] - v) * localT));
  return `rgb(${rgb.join(",")})`;
}

export default function HeatmapSection({ villes }: Props) {
  const [ville, setVille] = useState(villes[0] ?? "");
  const [pollutant, setPollutant] = useState<Pollutant>("pm2_5");
  const [points, setPoints] = useState<PointHeatmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ville) return;
    let annule = false;
    setLoading(true);

    fetch(`/api/heatmap?ville=${encodeURIComponent(ville)}&pollutant=${pollutant}`)
      .then((res) => res.json())
      .then((json) => {
        if (!annule) setPoints(json.data ?? []);
      })
      .finally(() => {
        if (!annule) setLoading(false);
      });

    return () => {
      annule = true;
    };
  }, [ville, pollutant]);

  const { grille, max } = useMemo(() => {
    const grille = new Map<string, number>();
    let max = 0;
    for (const p of points) {
      grille.set(`${p.jour_semaine}-${p.heure}`, p.valeur);
      if (p.valeur > max) max = p.valeur;
    }
    return { grille, max };
  }, [points]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            Cycle horaire de la pollution
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Moyenne par jour de semaine et heure UTC — révèle les effets de
            trafic et d&apos;inversion thermique.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="rounded-sm border border-border bg-surface px-2.5 py-1.5 font-mono text-xs font-medium text-ink"
          >
            {villes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={pollutant}
            onChange={(e) => setPollutant(e.target.value as Pollutant)}
            className="rounded-sm border border-border bg-surface px-2.5 py-1.5 font-mono text-xs font-medium text-ink"
          >
            {POLLUTANTS.filter((p) => p !== "aqi").map((p) => (
              <option key={p} value={p}>
                {POLLUTANT_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface-raised p-4 shadow-card sm:p-5">
        {loading ? (
          <p className="py-16 text-center text-sm text-ink-faint">
            Chargement depuis Neon…
          </p>
        ) : (
          <table className="w-full min-w-[640px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-16" />
                {Array.from({ length: 24 }, (_, h) => (
                  <th
                    key={h}
                    className="pb-1 text-center font-mono text-[10px] font-normal text-ink-faint"
                  >
                    {h % 3 === 0 ? h : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {JOURS_ORDRE.map((jour) => (
                <tr key={jour}>
                  <td className="pr-2 text-right text-xs text-ink-muted">
                    {jour.slice(0, 3)}
                  </td>
                  {Array.from({ length: 24 }, (_, h) => {
                    const valeur = grille.get(`${jour}-${h}`);
                    return (
                      <td key={h}>
                        <div
                          title={
                            valeur !== undefined
                              ? `${jour} ${h}h — ${formatNombre(valeur)}`
                              : undefined
                          }
                          className="h-4 w-4 rounded-[3px] sm:h-5 sm:w-5"
                          style={{
                            backgroundColor:
                              valeur !== undefined
                                ? couleurIntensite(valeur, max)
                                : "#171C24",
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
