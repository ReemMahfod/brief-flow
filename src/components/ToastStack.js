import { useNotifications } from '../context/NotificationContext';
import { Icon } from './Icon';

const toneStyles = {
  success: 'border-emerald-200 bg-white',
  info: 'border-sky-200 bg-white',
  warning: 'border-amber-200 bg-white',
};

const accentStyles = {
  success: 'bg-emerald-50 text-emerald-700',
  info: 'bg-sky-50 text-sky-700',
  warning: 'bg-amber-50 text-amber-700',
};

export default function ToastStack() {
  const { toasts, dismissToast } = useNotifications();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-rise flex gap-3 rounded-2xl border p-3.5 shadow-lift ${
            toneStyles[toast.type] || toneStyles.success
          }`}
          role="status"
        >
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              accentStyles[toast.type] || accentStyles.success
            }`}
          >
            <Icon name="bell" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-950">{toast.title}</p>
            {toast.message && (
              <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                {toast.message}
              </p>
            )}
          </div>
          <button
            type="button"
            className="self-start text-xs font-semibold text-ink-400 hover:text-ink-700"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
