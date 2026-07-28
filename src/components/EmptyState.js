import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-400">
        <Icon name="meetings" className="h-5 w-5" />
      </span>
      <p className="font-display text-lg font-semibold text-ink-900">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-500">
          {description}
        </p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
