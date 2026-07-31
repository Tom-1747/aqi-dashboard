import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fond le plus profond (page), fond des panneaux légèrement élevés,
        // fond au survol — trois paliers seulement, dans l'esprit console de
        // supervision (Grafana/Datadog) plutôt qu'un dégradé de gris flou.
        bg: "#0A0E13",
        surface: "#10151C",
        "surface-raised": "#161C24",
        "surface-hover": "#1B222B",
        border: "#232B34",
        "border-strong": "#2E3742",
        ink: "#E7EAED",
        "ink-muted": "#9CA6B0",
        "ink-faint": "#5F6A75",
        pine: "#46C2A0",
        "pine-dark": "#2E8A70",
        "pine-glow": "rgba(70, 194, 160, 0.14)",
        // Échelle de sévérité AQI (1 = bon .. 5 = très mauvais), réservée
        // exclusivement à la sévérité pour ne jamais être confondue avec
        // les couleurs catégorielles des villes.
        aqi1: "#5FC98B",
        aqi2: "#D8C05E",
        aqi3: "#E3A455",
        aqi4: "#E2724F",
        aqi5: "#C85C93",
        // Palette catégorielle par ville
        "city-antananarivo": "#4FBFA0",
        "city-paris": "#7DB2E8",
        "city-nairobi": "#DDB868",
        "city-mumbai": "#CB93B8",
        "city-beijing": "#ABA294",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255, 255, 255, 0.02) inset, 0 8px 24px rgba(0, 0, 0, 0.28)",
        glow: "0 0 0 1px rgba(70, 194, 160, 0.25), 0 0 24px rgba(70, 194, 160, 0.12)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 0%, rgba(70,194,160,0.10), transparent 45%)",
        dashboard:
          "radial-gradient(circle at 8% 0%, rgba(70,194,160,0.13), transparent 28%), radial-gradient(circle at 90% 12%, rgba(125,178,232,0.08), transparent 25%)",
      },
    },
  },
  plugins: [],
};

export default config;
