import { NextResponse } from "next/server";
import { getOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getOverview();
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de lire les agrégats depuis Neon." },
      { status: 500 }
    );
  }
}
