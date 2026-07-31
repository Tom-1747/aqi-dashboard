import { sql } from "./db";
import type { Pollutant } from "./constants";
import type {
  VilleOverview,
  DistributionAqi,
  DerniereMesure,
  PointSerieTemporelle,
  PointHeatmap,
  PlageDates,
} from "./types";

/** Moyennes de tous les polluants + AQI, par ville, sur toute la période chargée. */
export async function getOverview(): Promise<VilleOverview[]> {
  const rows = await sql`
    SELECT
      v.nom AS ville,
      v.pays AS pays,
      v.latitude::float AS latitude,
      v.longitude::float AS longitude,
      COUNT(*)::int AS n_mesures,
      ROUND(AVG(f.aqi)::numeric, 2)::float AS aqi_moyen,
      ROUND(AVG(f.pm2_5)::numeric, 2)::float AS pm2_5_moyen,
      ROUND(AVG(f.pm10)::numeric, 2)::float AS pm10_moyen,
      ROUND(AVG(f.no2)::numeric, 2)::float AS no2_moyen,
      ROUND(AVG(f.o3)::numeric, 2)::float AS o3_moyen,
      ROUND(AVG(f.co)::numeric, 2)::float AS co_moyen,
      ROUND(AVG(f.so2)::numeric, 2)::float AS so2_moyen,
      ROUND(AVG(f.nh3)::numeric, 2)::float AS nh3_moyen
    FROM fact_qualite_air f
    JOIN dim_ville v ON v.id_ville = f.id_ville
    GROUP BY v.nom, v.pays, v.latitude, v.longitude
    ORDER BY aqi_moyen DESC;
  `;
  return rows as VilleOverview[];
}

/** Répartition du temps passé dans chaque catégorie AQI (1 à 5), par ville, en %. */
export async function getDistributionAqi(): Promise<DistributionAqi[]> {
  const rows = (await sql`
    SELECT v.nom AS ville, f.aqi AS aqi, COUNT(*)::int AS n
    FROM fact_qualite_air f
    JOIN dim_ville v ON v.id_ville = f.id_ville
    GROUP BY v.nom, f.aqi
    ORDER BY v.nom, f.aqi;
  `) as { ville: string; aqi: number; n: number }[];

  const totauxParVille = new Map<string, number>();
  for (const r of rows) {
    totauxParVille.set(r.ville, (totauxParVille.get(r.ville) ?? 0) + r.n);
  }

  return rows.map((r) => ({
    ...r,
    part: (r.n / (totauxParVille.get(r.ville) ?? 1)) * 100,
  }));
}

/** Dernière mesure connue pour chaque ville (pour le classement en temps réel). */
export async function getDernieresMesures(): Promise<DerniereMesure[]> {
  const rows = await sql`
    SELECT DISTINCT ON (v.nom)
      v.nom AS ville,
      v.pays AS pays,
      t.timestamp_utc AS timestamp_utc,
      f.aqi AS aqi,
      f.pm2_5 AS pm2_5,
      f.pm10 AS pm10,
      f.no2 AS no2,
      f.o3 AS o3
    FROM fact_qualite_air f
    JOIN dim_ville v ON v.id_ville = f.id_ville
    JOIN dim_temps t ON t.id_temps = f.id_temps
    ORDER BY v.nom, t.timestamp_utc DESC;
  `;
  return rows as DerniereMesure[];
}

/** Bornes temporelles couvertes par l'entrepôt. */
export async function getPlageDates(): Promise<PlageDates> {
  const rows = (await sql`
    SELECT MIN(timestamp_utc) AS debut, MAX(timestamp_utc) AS fin
    FROM dim_temps;
  `) as PlageDates[];
  return rows[0];
}

/** Série temporelle journalière (moyenne du polluant demandé), toutes villes confondues. */
export async function getSerieTemporelle(
  pollutant: Pollutant
): Promise<PointSerieTemporelle[]> {
  // `pollutant` est validé en amont (isValidPollutant) contre une liste blanche
  // avant d'atteindre cette fonction : l'interpolation du nom de colonne est donc sûre.
  const query = `
    SELECT v.nom AS ville, t.date AS jour, ROUND(AVG(f.${pollutant})::numeric, 2)::float AS valeur
    FROM fact_qualite_air f
    JOIN dim_ville v ON v.id_ville = f.id_ville
    JOIN dim_temps t ON t.id_temps = f.id_temps
    GROUP BY v.nom, t.date
    ORDER BY t.date ASC;
  `;
  const rows = await sql.query(query);
  return (rows as unknown as { ville: string; jour: string; valeur: number }[]).map(
    (r) => ({ ...r, jour: new Date(r.jour).toISOString().slice(0, 10) })
  );
}

/** Moyenne du polluant demandé par (jour de semaine × heure), pour une ville donnée. */
export async function getHeatmap(
  ville: string,
  pollutant: Pollutant
): Promise<PointHeatmap[]> {
  const query = `
    SELECT t.jour_semaine AS jour_semaine, t.heure AS heure,
           ROUND(AVG(f.${pollutant})::numeric, 2)::float AS valeur
    FROM fact_qualite_air f
    JOIN dim_ville v ON v.id_ville = f.id_ville
    JOIN dim_temps t ON t.id_temps = f.id_temps
    WHERE v.nom = $1
    GROUP BY t.jour_semaine, t.heure
    ORDER BY t.heure;
  `;
  const rows = await sql.query(query, [ville]);
  return rows as unknown as PointHeatmap[];
}

/** Liste des villes suivies (pour peupler les sélecteurs côté client). */
export async function getVilles(): Promise<{ nom: string; pays: string }[]> {
  const rows = await sql`
    SELECT nom, pays FROM dim_ville ORDER BY nom;
  `;
  return rows as { nom: string; pays: string }[];
}
