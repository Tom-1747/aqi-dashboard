import { NextResponse } from "next/server";
import { getDistributionAqi } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getDistributionAqi();
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de lire la répartition AQI depuis Neon." },
      { status: 500 }
    );
  }
}
