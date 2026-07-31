import { NextRequest, NextResponse } from "next/server";
import { getHeatmap } from "@/lib/queries";
import { isValidPollutant } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ville = req.nextUrl.searchParams.get("ville");
  const pollutant = req.nextUrl.searchParams.get("pollutant") ?? "pm2_5";

  if (!ville) {
    return NextResponse.json(
      { error: "Le paramètre 'ville' est requis." },
      { status: 400 }
    );
  }
  if (!isValidPollutant(pollutant)) {
    return NextResponse.json(
      { error: `Polluant inconnu: ${pollutant}` },
      { status: 400 }
    );
  }

  try {
    const data = await getHeatmap(ville, pollutant);
    return NextResponse.json({ data, ville, pollutant });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de lire la heatmap depuis Neon." },
      { status: 500 }
    );
  }
}
