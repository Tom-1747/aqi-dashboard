import DashboardShell from "@/components/DashboardShell";
import PageIntro from "@/components/PageIntro";
import RankingTable from "@/components/RankingTable";
import { getDernieresMesures } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ClassementPage() {
  const mesures = await getDernieresMesures();
  const plusPollue = [...mesures].sort((a, b) => b.aqi - a.aqi)[0];
  return <DashboardShell><PageIntro eyebrow="Lecture instantanée" title="Classement en direct" description="Les dernières observations disponibles, classées de l’air le plus dégradé au plus sain." aside={plusPollue ? <div className="rounded-lg border border-aqi4/30 bg-aqi4/10 px-3 py-2 text-xs text-aqi4"><span className="font-mono font-semibold">{plusPollue.aqi}</span> · niveau le plus élevé</div> : undefined} /><section className="mt-8"><RankingTable mesures={mesures} /></section></DashboardShell>;
}
