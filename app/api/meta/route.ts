import { NextResponse } from "next/server";
import { getVilles, getPlageDates } from "@/lib/queries";
import { POLLUTANTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [villes, plage] = await Promise.all([getVilles(), getPlageDates()]);
    return NextResponse.json({ villes, plage, pollutants: POLLUTANTS });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de lire les métadonnées depuis Neon." },
      { status: 500 }
    );
  }
}
