"use client";

import { useEffect } from "react";
import CityGlobe from "./CityGlobe";
import { CITY_COLORS, CITY_FLAGS } from "@/lib/constants";
import { formatNombre } from "@/lib/format";

export interface VilleGlobeInfo {
  ville: string;
  pays: string;
  latitude: number;
  longitude: number;
  aqiMoyen: number;
}

export default function VilleGlobeModal({
  ville,
  onClose,
}: {
  ville: VilleGlobeInfo;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Localisation de ${ville.ville}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-md border border-border-strong bg-surface-raised p-6 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
              Localisation
            </p>
            <h3 className="mt-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <span>{CITY_FLAGS[ville.ville]}</span>
              {ville.ville}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-sm p-1 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-md border border-border bg-bg p-3">
          <CityGlobe
            latitude={ville.latitude}
            longitude={ville.longitude}
            color={CITY_COLORS[ville.ville] ?? "#46C2A0"}
            size={220}
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-ink-faint">Latitude</dt>
            <dd className="font-mono tabular text-ink">{formatNombre(ville.latitude, 4)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Longitude</dt>
            <dd className="font-mono tabular text-ink">{formatNombre(ville.longitude, 4)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Pays</dt>
            <dd className="text-ink">{ville.pays}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">AQI moyen</dt>
            <dd className="font-mono tabular text-ink">{formatNombre(ville.aqiMoyen, 2)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
