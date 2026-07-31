"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "overview" | "ranking" | "trend" | "radar" | "clock";

const NAVIGATION: { href: string; label: string; description: string; icon: IconName; group: string }[] = [
  { href: "/", label: "Vue d'ensemble", description: "Le signal global", icon: "overview", group: "Surveillance" },
  { href: "/classement", label: "Classement", description: "Mesures les plus récentes", icon: "ranking", group: "Surveillance" },
  { href: "/tendances", label: "Tendances", description: "Évolution quotidienne", icon: "trend", group: "Analyses" },
  { href: "/polluants", label: "Polluants", description: "Profil comparatif", icon: "radar", group: "Analyses" },
  { href: "/cycle-horaire", label: "Cycle horaire", description: "Rythmes par heure", icon: "clock", group: "Analyses" },
];

function Icon({ name }: { name: IconName }) {
  const common = "h-[18px] w-[18px]";
  if (name === "overview") return <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true"><path d="M4 13h5V4H4v9Zm0 7h5v-4H4v4Zm7 0h9v-9h-9v9Zm0-16v4h9V4h-9Z" fill="currentColor" /></svg>;
  if (name === "ranking") return <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true"><path d="M7 20v-7m5 7V4m5 16v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (name === "trend") return <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true"><path d="m4 16 5-5 3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "radar") return <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function NavLink({ item, compact = false }: { item: (typeof NAVIGATION)[number]; compact?: boolean }) {
  const pathname = usePathname();
  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.description}
      className={`group relative flex items-center gap-3 rounded-md transition-all ${
        compact ? "shrink-0 px-3 py-2 text-xs" : "px-3 py-2.5 text-sm"
      } ${
        active
          ? "bg-pine-glow text-pine shadow-[inset_0_0_0_1px_rgba(70,194,160,0.18)]"
          : "text-ink-muted hover:bg-surface-hover hover:text-ink"
      }`}
    >
      <span className={active ? "text-pine" : "text-ink-faint transition-colors group-hover:text-ink-muted"}>
        <Icon name={item.icon} />
      </span>
      <span className="whitespace-nowrap font-medium">{item.label}</span>
      {!compact && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-pine shadow-[0_0_10px_#46C2A0]" />}
    </Link>
  );
}

export default function Sidebar() {
  const groups = Array.from(new Set(NAVIGATION.map((item) => item.group)));

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-border bg-surface/95 px-4 py-5 backdrop-blur lg:flex">
        <div className="px-2">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine font-display text-base font-bold text-bg shadow-glow">A</span>
            <span>
              <span className="block font-display text-xl font-semibold tracking-tight text-ink">Atmos</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Air intelligence</span>
            </span>
          </Link>
          <p className="mt-5 border-l border-pine/50 pl-3 text-xs leading-relaxed text-ink-faint">
            Une lecture claire de la qualité de l&apos;air, ville par ville.
          </p>
        </div>

        <nav className="mt-8 space-y-6" aria-label="Navigation principale">
          {groups.map((group) => (
            <div key={group}>
              <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">{group}</p>
              <div className="space-y-1">
                {NAVIGATION.filter((item) => item.group === group).map((item) => <NavLink key={item.href} item={item} />)}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-border bg-bg/60 p-3.5">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-pine" /></span>
            Flux de données actif
          </div>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-faint">OpenWeather · Neon<br />Mise à jour horaire</p>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pine font-display text-sm font-bold text-bg">A</span><span className="font-display font-semibold text-ink">Atmos</span></Link>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint"><span className="h-1.5 w-1.5 rounded-full bg-pine" /> Live</span>
        </div>
        <nav className="mt-3 -mx-1 flex gap-1 overflow-x-auto pb-0.5" aria-label="Navigation mobile">
          {NAVIGATION.map((item) => <NavLink key={item.href} item={item} compact />)}
        </nav>
      </header>
    </>
  );
}
