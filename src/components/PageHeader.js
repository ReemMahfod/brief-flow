export default function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 animate-rise">
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-display text-[1.85rem] font-semibold tracking-tight text-ink-950 sm:text-[2.15rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
