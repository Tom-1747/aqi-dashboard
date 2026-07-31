"use client";

import { useState } from "react";
import AtmosphereBar from "./AtmosphereBar";
import VilleGlobeModal from "./VilleGlobeModal";
import type { VilleOverview, DistributionAqi } from "@/lib/types";

interface Props {
  overview: VilleOverview[];
  distribution: DistributionAqi[];
}

export default function AtmosphereSection({ overview, distribution }: Props) {
  const [selectionnee, setSelectionnee] = useState<VilleOverview | null>(null);

  return (
    <>
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-raised shadow-card">
        {overview.map((v) => (
          <button
            key={v.ville}
            type="button"
            onClick={() => setSelectionnee(v)}
            title={`Voir ${v.ville} sur le globe`}
            className="group block w-full cursor-pointer text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pine"
          >
            <AtmosphereBar
              ville={v.ville}
              aqiMoyen={v.aqi_moyen}
              repartition={distribution.filter((d) => d.ville === v.ville)}
            />
          </button>
        ))}
      </div>

      {selectionnee && (
        <VilleGlobeModal
          ville={{
            ville: selectionnee.ville,
            pays: selectionnee.pays,
            latitude: selectionnee.latitude,
            longitude: selectionnee.longitude,
            aqiMoyen: selectionnee.aqi_moyen,
          }}
          onClose={() => setSelectionnee(null)}
        />
      )}
    </>
  );
}
