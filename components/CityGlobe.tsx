"use client";

import { useEffect, useRef } from "react";
import landTopology from "world-atlas/land-110m.json";
import { feature } from "topojson-client";
import type { FeatureCollection, MultiPolygon } from "geojson";
import type { Topology } from "topojson-specification";

interface Props {
  latitude: number;
  longitude: number;
  color: string;
  size?: number;
}

const GRID_STEP_DEG = 15;
const SPIN_DEG_PAR_SEC = 6;

type PointGeographique = { lat: number; lon: number };

// Données Natural Earth fournies par world-atlas. Elles sont converties une
// seule fois en contours latitude/longitude puis projetées à chaque frame.
const carteDuMonde = feature(
  landTopology as unknown as Topology,
  (landTopology as unknown as Topology).objects.land
) as FeatureCollection<MultiPolygon>;

const CONTOURS_DES_TERRES: PointGeographique[][] = carteDuMonde.features.flatMap(
  ({ geometry }) =>
    geometry.coordinates.flatMap((polygone) =>
      polygone.map((anneau) =>
        anneau.map(([lon, lat]) => ({ lat, lon }))
      )
    )
);

function versRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * Globe dessiné en Canvas 2D (projection orthographique simple). La carte
 * terrestre Natural Earth de world-atlas est projetée sur la sphère afin de
 * situer la ville, sans ajouter le poids d'un moteur 3D.
 */
export default function CityGlobe({ latitude, longitude, color, size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const reduitMouvement = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const R = size / 2 - 16;
    const cx = size / 2;
    const cy = size / 2;
    const latVille = versRad(latitude);
    const lonVille = versRad(longitude);
    const inclinaison = versRad(18);
    const rotationInitiale = -lonVille;

    let raf = 0;
    let debut: number | null = null;

    function projeter(latRad: number, lonRad: number, rotation: number) {
      const lon = lonRad + rotation;
      const x0 = Math.cos(latRad) * Math.sin(lon);
      const y0 = Math.sin(latRad);
      const z0 = Math.cos(latRad) * Math.cos(lon);
      const y = y0 * Math.cos(inclinaison) - z0 * Math.sin(inclinaison);
      const z = y0 * Math.sin(inclinaison) + z0 * Math.cos(inclinaison);
      return { x: x0, y, z };
    }

    function tracerLigne(points: PointGeographique[], rotation: number) {
      ctx!.beginPath();
      let trace = false;
      for (const { lat, lon } of points) {
        const p = projeter(versRad(lat), versRad(lon), rotation);
        if (p.z < 0) {
          trace = false;
          continue;
        }
        const px = cx + p.x * R;
        const py = cy - p.y * R;
        if (!trace) {
          ctx!.moveTo(px, py);
          trace = true;
        } else {
          ctx!.lineTo(px, py);
        }
      }
      ctx!.strokeStyle = "rgba(156, 166, 176, 0.16)";
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    function tracerContoursTerrestres(rotation: number) {
      ctx!.strokeStyle = "rgba(111, 202, 171, 0.72)";
      ctx!.lineWidth = 0.85;

      for (const contour of CONTOURS_DES_TERRES) {
        ctx!.beginPath();
        let trace = false;

        for (const { lat, lon } of contour) {
          const p = projeter(versRad(lat), versRad(lon), rotation);
          if (p.z < 0) {
            trace = false;
            continue;
          }

          const px = cx + p.x * R;
          const py = cy - p.y * R;
          if (!trace) {
            ctx!.moveTo(px, py);
            trace = true;
          } else {
            ctx!.lineTo(px, py);
          }
        }
        ctx!.stroke();
      }
    }

    function dessiner(timestamp: number) {
      if (debut === null) debut = timestamp;
      const ecouleSec = (timestamp - debut) / 1000;
      const rotation = reduitMouvement
        ? rotationInitiale
        : rotationInitiale + versRad(SPIN_DEG_PAR_SEC) * ecouleSec;

      ctx!.clearRect(0, 0, size, size);

      // Disque de fond
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = "#0A0E13";
      ctx!.fill();

      // Carte du monde : seuls les contours du côté visible sont tracés,
      // ce qui évite que les continents de l'autre hémisphère traversent
      // visuellement le globe.
      tracerContoursTerrestres(rotation);

      // Méridiens
      for (let lon = -180; lon < 180; lon += GRID_STEP_DEG) {
        const pts: { lat: number; lon: number }[] = [];
        for (let lat = -90; lat <= 90; lat += 3) pts.push({ lat, lon });
        tracerLigne(pts, rotation);
      }

      // Parallèles
      for (let lat = -60; lat <= 60; lat += GRID_STEP_DEG) {
        const pts: { lat: number; lon: number }[] = [];
        for (let lon = -180; lon <= 180; lon += 3) pts.push({ lat, lon });
        tracerLigne(pts, rotation);
      }

      // Marqueur de la ville
      const p = projeter(latVille, lonVille, rotation);
      if (p.z > -0.05) {
        const px = cx + p.x * R;
        const py = cy - p.y * R;
        const opacite = Math.max(0.35, p.z);
        const pulse = 3 + Math.sin(ecouleSec * 4) * 1.1;

        ctx!.beginPath();
        ctx!.arc(px, py, pulse + 5, 0, Math.PI * 2);
        ctx!.fillStyle = color + "26";
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(px, py, 4, 0, Math.PI * 2);
        ctx!.globalAlpha = opacite;
        ctx!.fillStyle = color;
        ctx!.fill();
        ctx!.lineWidth = 1.5;
        ctx!.strokeStyle = "#FFFFFF";
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      // Contour du globe (léger glow pine, esprit "instrument")
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = "#3A4550";
      ctx!.shadowColor = "rgba(70, 194, 160, 0.25)";
      ctx!.shadowBlur = 8;
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      if (!reduitMouvement) {
        raf = requestAnimationFrame(dessiner);
      }
    }

    raf = requestAnimationFrame(dessiner);
    return () => cancelAnimationFrame(raf);
  }, [latitude, longitude, color, size]);

  return <canvas ref={canvasRef} className="mx-auto block" />;
}
