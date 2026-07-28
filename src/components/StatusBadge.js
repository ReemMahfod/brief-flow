import { STATUS_LABELS } from '../data/mockData';

const styles = {
  scheduled: 'bg-sky-50 text-sky-800 ring-sky-200/80',
  completed: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
  cancelled: 'bg-ink-50 text-ink-600 ring-ink-200/80',
  todo: 'bg-amber-50 text-amber-800 ring-amber-200/80',
  in_progress: 'bg-sky-50 text-sky-800 ring-sky-200/80',
  done: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
  overdue: 'bg-red-50 text-red-700 ring-red-200/80',
};

export default function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${
        styles[value] || 'bg-ink-50 text-ink-600 ring-ink-200/80'
      }`}
    >
      {STATUS_LABELS[value] || value}
    </span>
  );
}
