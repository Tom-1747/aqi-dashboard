import DashboardShell from "@/components/DashboardShell";
import PageIntro from "@/components/PageIntro";
import PollutantRadar from "@/components/PollutantRadar";
import { getOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PolluantsPage() {
  const overview = await getOverview();
  return <DashboardShell><PageIntro eyebrow="Composition de l’air" title="Profil des polluants" description="Chaque axe est normalisé par rapport à la ville la plus exposée : les composés restent ainsi comparables, quelle que soit leur unité." /><section className="mt-8 rounded-xl border border-border bg-surface-raised p-4 shadow-card sm:p-6"><PollutantRadar overview={overview} /></section></DashboardShell>;
}
