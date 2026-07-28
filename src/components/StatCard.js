export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'default',
  delay = 0,
}) {
  const tones = {
    default: 'text-ink-950',
    alert: 'text-rose-700',
    success: 'text-emerald-700',
    brand: 'text-brand-700',
  };

  return (
    <div
      className="group rounded-2xl border border-ink-200/70 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-rise"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-400">
          {label}
        </p>
        {icon && (
          <span className="rounded-lg bg-ink-50 p-1.5 text-ink-500 transition group-hover:bg-brand-50 group-hover:text-brand-700">
            {icon}
          </span>
        )}
      </div>
      <p
        className={`mt-2.5 font-display text-3xl font-semibold tracking-tight ${tones[tone] || tones.default}`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
