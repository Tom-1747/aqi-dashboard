import { NextResponse } from "next/server";
import { getDernieresMesures } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getDernieresMesures();
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de lire le classement depuis Neon." },
      { status: 500 }
    );
  }
}
