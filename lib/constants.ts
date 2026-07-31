export const POLLUTANTS = [
  "aqi",
  "pm2_5",
  "pm10",
  "no2",
  "o3",
  "co",
  "so2",
  "nh3",
] as const;

export type Pollutant = (typeof POLLUTANTS)[number];

export function isValidPollutant(value: string): value is Pollutant {
  return (POLLUTANTS as readonly string[]).includes(value);
}

export const POLLUTANT_LABELS: Record<Pollutant, string> = {
  aqi: "Indice AQI",
  pm2_5: "PM2.5",
  pm10: "PM10",
  no2: "NO₂",
  o3: "O₃",
  co: "CO",
  so2: "SO₂",
  nh3: "NH₃",
};

export const POLLUTANT_UNITS: Record<Pollutant, string> = {
  aqi: "échelle 1–5",
  pm2_5: "µg/m³",
  pm10: "µg/m³",
  no2: "µg/m³",
  o3: "µg/m³",
  co: "µg/m³",
  so2: "µg/m³",
  nh3: "µg/m³",
};

export const AQI_LABELS: Record<number, string> = {
  1: "Bon",
  2: "Moyen",
  3: "Dégradé",
  4: "Mauvais",
  5: "Très mauvais",
};

// Palette recalibrée pour contraste et lisibilité sur fond sombre (chaque
// teinte a été éclaircie/désaturée par rapport à une palette conçue pour un
// fond clair, sans basculer vers des couleurs "néon" agressives).
export const AQI_COLORS: Record<number, string> = {
  1: "#5FC98B",
  2: "#D8C05E",
  3: "#E3A455",
  4: "#E2724F",
  5: "#C85C93",
};

export const CITY_SLUGS: Record<string, string> = {
  Antananarivo: "antananarivo",
  Paris: "paris",
  Nairobi: "nairobi",
  Mumbai: "mumbai",
  Beijing: "beijing",
};

export const CITY_COLORS: Record<string, string> = {
  Antananarivo: "#4FBFA0",
  Paris: "#7DB2E8",
  Nairobi: "#DDB868",
  Mumbai: "#CB93B8",
  Beijing: "#ABA294",
};

export const CITY_FLAGS: Record<string, string> = {
  Antananarivo: "🇲🇬",
  Paris: "🇫🇷",
  Nairobi: "🇰🇪",
  Mumbai: "🇮🇳",
  Beijing: "🇨🇳",
};

export const JOURS_ORDRE = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
