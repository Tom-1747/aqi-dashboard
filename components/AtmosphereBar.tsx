import { AQI_COLORS, AQI_LABELS, CITY_FLAGS } from "@/lib/constants";
import { formatNombre } from "@/lib/format";
import type { DistributionAqi } from "@/lib/types";

interface Props {
  ville: string;
  repartition: DistributionAqi[]; // déjà filtré pour cette ville, trié par aqi croissant
  aqiMoyen: number;
}

/**
 * Élément signature du tableau de bord : une bande horizontale par ville,
 * segmentée au prorata du temps réellement passé dans chaque catégorie AQI
 * (1 = bon … 5 = très mauvais). Contrairement à une jauge ou un simple
 * badge de couleur, elle montre la variabilité réelle de chaque ville plutôt
 * qu'un instantané — c'est la donnée la plus parlante du jeu de données.
 */
export default function AtmosphereBar({ ville, repartition, aqiMoyen }: Props) {
  const parts = [1, 2, 3, 4, 5].map((aqi) => {
    const entry = repartition.find((r) => r.aqi === aqi);
    return { aqi, part: entry?.part ?? 0 };
  });

  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="w-40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{CITY_FLAGS[ville]}</span>
          <span className="font-display text-sm font-medium text-ink">
            {ville}
          </span>
        </div>
        <p className="mt-0.5 font-mono text-xs text-ink-faint tabular">
          AQI moyen {formatNombre(aqiMoyen, 2)}
        </p>
      </div>

      <div className="flex h-6 flex-1 overflow-hidden rounded-sm bg-bg ring-1 ring-inset ring-border">
        {parts.map(({ aqi, part }) =>
          part > 0 ? (
            <div
              key={aqi}
              style={{
                width: `${part}%`,
                backgroundColor: AQI_COLORS[aqi],
              }}
              title={`${AQI_LABELS[aqi]} — ${formatNombre(part, 1)}% du temps`}
              className="h-full opacity-90 transition-opacity first:rounded-l-sm last:rounded-r-sm group-hover:opacity-100"
            />
          ) : null
        )}
      </div>

      <div className="hidden w-20 shrink-0 text-right font-mono text-xs text-ink-muted tabular xl:block">
        {formatNombre(parts[3].part + parts[4].part, 0)}% mauvais+
      </div>

      <svg
        className="hidden h-3.5 w-3.5 shrink-0 text-ink-faint transition-colors group-hover:text-pine sm:block"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
