import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import FilterBar from '../components/FilterBar';
import ListPanel from '../components/ListPanel';
import TaskRow from '../components/TaskRow';
import { effectiveTaskStatus, sortByNewest } from '../utils/helpers';

export default function Tasks() {
  const { tasks, meetings } = useApp();
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    const linked = tasks.filter((t) =>
      meetings.some((m) => String(m.id) === String(t.meetingId))
    );
    return sortByNewest(
      linked.filter((t) => status === 'all' || effectiveTaskStatus(t) === status),
      'dueDate'
    );
  }, [tasks, meetings, status]);

  return (
    <div className="page">
      <PageHeader
        title="Tasks"
        subtitle="Follow-ups from meetings — update status as work moves."
      />

      <FilterBar>
        <select
          className="input border-0 bg-mist-50 shadow-none sm:max-w-xs"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
          <option value="overdue">Overdue</option>
        </select>
      </FilterBar>

      <p className="meta">
        {filtered.length} task{filtered.length === 1 ? '' : 's'}
      </p>

      <ListPanel
        title="Task list"
        isEmpty={filtered.length === 0}
        emptyTitle="No tasks found"
        emptyDescription="Change the filter, or add tasks from a meeting."
        emptyActionLabel="Go to meetings"
        emptyActionTo="/meetings"
        bodyClassName="space-y-2.5 p-4"
      >
        {filtered.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </ListPanel>
    </div>
  );
}
