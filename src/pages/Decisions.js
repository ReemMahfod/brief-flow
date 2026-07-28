import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ListPanel from '../components/ListPanel';
import { Icon } from '../components/Icon';
import { formatDate, sortByNewest } from '../utils/helpers';

export default function Decisions() {
  const { decisions, meetings, getUser } = useApp();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const linked = decisions.filter((d) =>
      meetings.some((m) => String(m.id) === String(d.meetingId))
    );

    return sortByNewest(
      linked.filter((d) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const meeting = meetings.find((m) => String(m.id) === String(d.meetingId));
        return (
          d.text.toLowerCase().includes(q) ||
          meeting?.title?.toLowerCase().includes(q)
        );
      }),
      'createdAt'
    );
  }, [decisions, meetings, query]);

  return (
    <div className="page">
      <PageHeader
        title="Decisions"
        subtitle="Agreements captured from meetings — always linked to a live meeting."
      />

      <FilterBar>
        <input
          className="input border-0 bg-mist-50 shadow-none"
          placeholder="Search decisions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </FilterBar>

      <p className="meta">
        {rows.length} decision{rows.length === 1 ? '' : 's'}
      </p>

      <ListPanel
        title="Decision log"
        isEmpty={rows.length === 0}
        emptyTitle="No decisions yet"
        emptyDescription="Add decisions from a meeting details page."
        emptyActionLabel="Go to meetings"
        emptyActionTo="/meetings"
        bodyClassName="space-y-3 p-4"
      >
        {rows.map((d) => {
          const meeting = meetings.find((m) => String(m.id) === String(d.meetingId));
          return (
            <article
              key={d.id}
              className="rounded-xl border border-ink-100 bg-white px-4 py-3.5 transition hover:border-ink-200"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon name="decisions" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-relaxed text-ink-900">
                    {d.text}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
                    {meeting && (
                      <Link
                        to={`/meetings/${meeting.id}`}
                        className="font-semibold text-brand-700 hover:underline"
                      >
                        {meeting.title}
                      </Link>
                    )}
                    <span>·</span>
                    <span>{getUser(d.ownerId)?.name}</span>
                    <span>·</span>
                    <span>{formatDate(d.createdAt, false)}</span>
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </ListPanel>
    </div>
  );
}
