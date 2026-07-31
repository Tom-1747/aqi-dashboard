import { NextRequest, NextResponse } from "next/server";
import { getSerieTemporelle } from "@/lib/queries";
import { isValidPollutant } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pollutant = req.nextUrl.searchParams.get("pollutant") ?? "aqi";

  if (!isValidPollutant(pollutant)) {
    return NextResponse.json(
      { error: `Polluant inconnu: ${pollutant}` },
      { status: 400 }
    );
  }

  try {
    const data = await getSerieTemporelle(pollutant);
    return NextResponse.json({ data, pollutant });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de lire la série temporelle depuis Neon." },
      { status: 500 }
    );
  }
}
