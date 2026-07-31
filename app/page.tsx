import DashboardShell from "@/components/DashboardShell";
import PageIntro from "@/components/PageIntro";
import Link from "next/link";
import AtmosphereSection from "@/components/AtmosphereSection";
import AqiLegend from "@/components/AqiLegend";
import KpiCard from "@/components/KpiCard";
import { getDistributionAqi, getOverview, getPlageDates } from "@/lib/queries";
import { formatDate, formatNombre } from "@/lib/format";
import { CITY_COLORS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [overview, distribution, plage] = await Promise.all([
    getOverview(),
    getDistributionAqi(),
    getPlageDates(),
  ]);
  const parVilleTriee = [...overview].sort((a, b) => b.aqi_moyen - a.aqi_moyen);
  const plusPollue = parVilleTriee[0];
  const plusPropre = parVilleTriee.at(-1);
  const totalMesures = overview.reduce((acc, ville) => acc + ville.n_mesures, 0);
  const ecart = (plusPollue?.pm2_5_moyen ?? 0) / (plusPropre?.pm2_5_moyen || 1);

  return (
    <DashboardShell>
      <PageIntro
        eyebrow="Centre de surveillance"
        title="La qualité de l’air, en un regard."
        description="Comparez les signaux essentiels entre les villes suivies et explorez chaque analyse dans son espace dédié."
        aside={<div className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-mono text-[11px] text-ink-muted"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-pine shadow-[0_0_8px_#46C2A0]" />Données en direct</div>}
      />

      <section className="mt-7 grid gap-3 sm:grid-cols-3">
        <KpiCard label="Villes surveillées" value={String(parVilleTriee.length)} unit="villes" hint="sur trois continents" accent="#46C2A0" />
        <KpiCard label="Écart PM2.5" value={`${formatNombre(ecart, 0)}×`} unit="" hint={`${plusPollue?.ville ?? "—"} vs ${plusPropre?.ville ?? "—"}`} accent="#E3A455" />
        <KpiCard label="Observations" value={totalMesures.toLocaleString("fr-FR")} unit="mesures" hint={`${formatDate(plage.debut)} → ${formatDate(plage.fin)}`} accent="#7DB2E8" />
      </section>

      {plusPollue && (
        <section className="mt-5 flex flex-col gap-4 rounded-xl border border-pine/20 bg-pine-glow/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine/15 text-pine">↗</span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-pine">Signal prioritaire</p>
              <p className="mt-1 text-sm text-ink"><span className="font-semibold">{plusPollue.ville}</span> présente l&apos;AQI moyen le plus élevé de l&apos;échantillon ({formatNombre(plusPollue.aqi_moyen, 2)}).</p>
            </div>
          </div>
          <Link href="/classement" className="shrink-0 rounded-md border border-border-strong bg-surface-raised px-3 py-2 text-center text-xs font-medium text-ink transition-colors hover:border-pine hover:text-pine">Voir le classement →</Link>
        </section>
      )}

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Panorama par ville</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Où l&apos;air est-il le plus respirable ?</h2>
            <p className="mt-1 text-sm text-ink-muted">Cliquez sur une ville pour la localiser sur le globe et voir son AQI moyen.</p>
          </div>
          <AqiLegend />
        </div>
        <AtmosphereSection overview={parVilleTriee} distribution={distribution} />
      </section>

      <section className="mt-10 pb-8">
        <div className="mb-3 flex items-center justify-between"><div><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Repères rapides</p><h2 className="mt-1 font-display text-xl font-semibold text-ink">AQI moyen par ville</h2></div><span className="text-xs text-ink-faint">Toute la période</span></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {parVilleTriee.map((ville) => <KpiCard key={ville.ville} label={ville.ville} value={formatNombre(ville.aqi_moyen, 2)} unit="AQI moy." hint={`PM2.5 · ${formatNombre(ville.pm2_5_moyen)} µg/m³`} accent={CITY_COLORS[ville.ville]} />)}
        </div>
      </section>
    </DashboardShell>
  );
}
