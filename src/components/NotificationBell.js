import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Icon } from './Icon';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const { items, unreadCount, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200/80 bg-white text-ink-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        aria-label="Notifications"
      >
        <Icon name="bell" className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[70] mt-2 w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-lift animate-rise">
          <div className="flex items-center justify-between border-b border-ink-100 px-3.5 py-2.5">
            <p className="text-sm font-semibold text-ink-950">Notifications</p>
            {items.length > 0 && (
              <button
                type="button"
                className="text-xs font-semibold text-ink-500 hover:text-brand-700"
                onClick={clearAll}
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-500">
                No notifications yet
              </p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-ink-50 px-3.5 py-3 last:border-0 ${
                    n.read ? 'bg-white' : 'bg-brand-50/40'
                  }`}
                >
                  <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                  {n.message && (
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                      {n.message}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-ink-400">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
