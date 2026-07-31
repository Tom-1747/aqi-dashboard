interface Props {
  eyebrow: string;
  title: string;
  description: string;
  aside?: React.ReactNode;
}

export default function PageIntro({ eyebrow, title, description, aside }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-pine">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>
      </div>
      {aside}
    </header>
  );
}
