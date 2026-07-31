import DashboardShell from "@/components/DashboardShell";
import PageIntro from "@/components/PageIntro";
import HeatmapSection from "@/components/HeatmapSection";
import { getOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CycleHorairePage() {
  const overview = await getOverview();
  return <DashboardShell><PageIntro eyebrow="Rythmes & habitudes" title="Cycle horaire de la pollution" description="Identifiez les créneaux les plus exposés selon le jour, la ville et le polluant : trafic, activité urbaine ou variations météorologiques." /><div className="mt-8"><HeatmapSection villes={overview.map(({ ville }) => ville)} /></div></DashboardShell>;
}
