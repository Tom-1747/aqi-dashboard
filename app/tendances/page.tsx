import DashboardShell from "@/components/DashboardShell";
import PageIntro from "@/components/PageIntro";
import TrendsSection from "@/components/TrendsSection";

export default function TendancesPage() {
  return <DashboardShell><PageIntro eyebrow="Analyse temporelle" title="Tendances journalières" description="Suivez l’évolution moyenne de chaque ville et basculez entre les polluants pour révéler les trajectoires." /><div className="mt-8"><TrendsSection /></div></DashboardShell>;
}
