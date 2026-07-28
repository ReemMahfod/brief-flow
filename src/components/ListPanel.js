import { Link } from 'react-router-dom';
import EmptyState from './EmptyState';
import Panel from './Panel';

export default function ListPanel({
  title,
  actionLabel,
  actionTo,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionTo,
  children,
  isEmpty = false,
  bodyClassName = '',
  className = '',
}) {
  return (
    <Panel padding={false} className={className}>
      <div className="flex items-center justify-between gap-3 border-b border-ink-100/90 px-5 py-3.5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink-950">
          {title}
        </h2>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="soft-link">
            {actionLabel}
          </Link>
        )}
      </div>
      <div className={bodyClassName || (isEmpty ? '' : 'px-5')}>
        {isEmpty ? (
          <EmptyState
            title={emptyTitle || 'Nothing here yet'}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            actionTo={emptyActionTo}
          />
        ) : (
          children
        )}
      </div>
    </Panel>
  );
}
