import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from './Icon';
import NotificationBell from './NotificationBell';
import ToastStack from './ToastStack';
import { useApp } from '../context/AppContext';
import { ROLE_LABELS } from '../data/mockData';

const nav = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/meetings', label: 'Meetings', icon: 'meetings' },
  { to: '/tasks', label: 'Tasks', icon: 'tasks' },
  { to: '/decisions', label: 'Decisions', icon: 'decisions' },
  { to: '/reports', label: 'Reports', icon: 'reports' },
];

function NavItems({ onNavigate }) {
  return nav.map((item, index) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      style={{ animationDelay: `${index * 35}ms` }}
      className={({ isActive }) =>
        `animate-rise group flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
          isActive
            ? 'bg-white text-ink-950 shadow-lift'
            : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            name={item.icon}
            className={`h-4 w-4 shrink-0 ${
              isActive ? 'text-brand-700' : 'opacity-80'
            }`}
          />
          {item.label}
        </>
      )}
    </NavLink>
  ));
}

export default function Layout() {
  const { currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (currentUser?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-transparent">
      {/* Desktop sidebar — fixed */}
      <aside className="relative hidden w-[248px] shrink-0 flex-col overflow-hidden border-r border-white/5 bg-[#121820] text-white lg:flex">
        <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex h-full flex-col gap-7 p-5">
          <div className="animate-fade px-1">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-base font-semibold shadow-lift">
                B
              </span>
              <div>
                <p className="font-display text-xl font-semibold leading-none tracking-tight">
                  BriefFlow
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  Meetings · tasks · decisions
                </p>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            <NavItems />
          </nav>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-xs font-semibold text-brand-100">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {currentUser?.name}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-white/45">
                  {ROLE_LABELS[currentUser?.role]}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,17.5rem)] flex-col bg-[#121820] p-4 text-white shadow-lift animate-rise">
            <div className="mb-6 flex items-center justify-between px-1">
              <p className="font-display text-xl font-semibold">BriefFlow</p>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm text-white/70"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
              <NavItems onNavigate={() => setMobileOpen(false)} />
            </nav>
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/70"
            >
              Sign out
            </button>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar — mobile always; desktop for notifications */}
        <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-ink-200/60 bg-white/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:border-ink-200/40 lg:bg-white/70 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" className="h-4 w-4" />
            </button>
            <div className="min-w-0 lg:hidden">
              <p className="truncate font-display text-lg font-semibold text-ink-950">
                BriefFlow
              </p>
            </div>
            <p className="hidden truncate text-sm text-ink-500 lg:block">
              {currentUser?.name} · {ROLE_LABELS[currentUser?.role]}
            </p>
          </div>
          <NotificationBell />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastStack />
    </div>
  );
}
