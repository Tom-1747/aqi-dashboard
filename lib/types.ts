export interface VilleOverview {
  ville: string;
  pays: string;
  latitude: number;
  longitude: number;
  n_mesures: number;
  aqi_moyen: number;
  pm2_5_moyen: number;
  pm10_moyen: number;
  no2_moyen: number;
  o3_moyen: number;
  co_moyen: number;
  so2_moyen: number;
  nh3_moyen: number;
}

export interface DistributionAqi {
  ville: string;
  aqi: number;
  n: number;
  part: number; // pourcentage 0-100
}

export interface DerniereMesure {
  ville: string;
  pays: string;
  timestamp_utc: string;
  aqi: number;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface PointSerieTemporelle {
  ville: string;
  jour: string;
  valeur: number;
}

export interface PointHeatmap {
  jour_semaine: string;
  heure: number;
  valeur: number;
}

export interface PlageDates {
  debut: string;
  fin: string;
}
