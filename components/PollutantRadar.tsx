"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CITY_COLORS, POLLUTANT_LABELS } from "@/lib/constants";
import type { VilleOverview } from "@/lib/types";

interface Props {
  overview: VilleOverview[];
}

const AXES: { key: keyof VilleOverview; label: string }[] = [
  { key: "pm2_5_moyen", label: POLLUTANT_LABELS.pm2_5 },
  { key: "pm10_moyen", label: POLLUTANT_LABELS.pm10 },
  { key: "no2_moyen", label: POLLUTANT_LABELS.no2 },
  { key: "o3_moyen", label: POLLUTANT_LABELS.o3 },
  { key: "so2_moyen", label: POLLUTANT_LABELS.so2 },
  { key: "co_moyen", label: POLLUTANT_LABELS.co },
];

/**
 * Chaque polluant est ramené à une échelle 0-100 = (valeur de la ville / valeur
 * max observée pour ce polluant parmi les 5 villes). Nécessaire car le CO
 * (dizaines/centaines de µg/m³) et le NO2 (unités) n'ont pas la même échelle :
 * sans normalisation, un radar brut serait dominé visuellement par le CO.
 */
export default function PollutantRadar({ overview }: Props) {
  const maxParAxe = new Map<string, number>();
  for (const axe of AXES) {
    const max = Math.max(...overview.map((o) => Number(o[axe.key]) || 0));
    maxParAxe.set(axe.key, max || 1);
  }

  const data = AXES.map((axe) => {
    const row: Record<string, string | number> = { polluant: axe.label };
    for (const o of overview) {
      const val = Number(o[axe.key]) || 0;
      row[o.ville] = Math.round((val / (maxParAxe.get(axe.key) ?? 1)) * 100);
    }
    return row;
  });

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#232B34" />
          <PolarAngleAxis
            dataKey="polluant"
            tick={{ fontSize: 12, fill: "#9CA6B0" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#5F6A75" }}
            tickCount={5}
          />
          {overview.map((o) => (
            <Radar
              key={o.ville}
              name={o.ville}
              dataKey={o.ville}
              stroke={CITY_COLORS[o.ville] ?? "#46C2A0"}
              fill={CITY_COLORS[o.ville] ?? "#46C2A0"}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, color: "#9CA6B0" }} />
          <Tooltip
            formatter={(value: number) => `${value} / 100`}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              backgroundColor: "#161C24",
              borderColor: "#2E3742",
              color: "#E7EAED",
            }}
            labelStyle={{ color: "#9CA6B0" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
