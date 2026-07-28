import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MeetingCard from '../components/MeetingCard';
import PageHeader from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ListPanel from '../components/ListPanel';
import { sortByNewest } from '../utils/helpers';

export default function Meetings() {
  const { meetings } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return sortByNewest(
      meetings.filter((m) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          (m.title || '').toLowerCase().includes(q) ||
          (m.description || '').toLowerCase().includes(q);
        const matchesStatus = status === 'all' || m.status === status;
        return matchesQuery && matchesStatus;
      }),
      'date'
    );
  }, [meetings, query, status]);

  return (
    <div className="page">
      <PageHeader
        title="Meetings"
        subtitle="All scheduled, completed, and cancelled meetings in one place."
        actions={
          <Link to="/meetings/new" className="btn-primary">
            New meeting
          </Link>
        }
      />

      <FilterBar>
        <input
          className="input border-0 bg-mist-50 shadow-none"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input border-0 bg-mist-50 shadow-none sm:w-44"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </FilterBar>

      <p className="text-sm text-ink-500">
        {filtered.length} meeting{filtered.length === 1 ? '' : 's'}
      </p>

      <ListPanel
        title="Results"
        isEmpty={filtered.length === 0}
        emptyTitle="No meetings found"
        emptyDescription="Try another search, or create a new meeting."
        emptyActionLabel="New meeting"
        emptyActionTo="/meetings/new"
        bodyClassName="grid gap-3 p-4 lg:grid-cols-2"
      >
        {filtered.map((m) => (
          <MeetingCard key={m.id} meeting={m} />
        ))}
      </ListPanel>
    </div>
  );
}
