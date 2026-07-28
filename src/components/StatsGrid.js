import StatCard from './StatCard';

export default function StatsGrid({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          hint={item.hint}
          icon={item.icon}
          tone={item.tone}
          delay={(index + 1) * 50}
        />
      ))}
    </div>
  );
}
