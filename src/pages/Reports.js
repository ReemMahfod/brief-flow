import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import StatsGrid from '../components/StatsGrid';
import ListPanel from '../components/ListPanel';
import { Icon } from '../components/Icon';
import { effectiveTaskStatus } from '../utils/helpers';

export default function Reports() {
  const { meetings, tasks, decisions, users } = useApp();

  const linkedTasks = useMemo(
    () =>
      tasks.filter((t) =>
        meetings.some((m) => String(m.id) === String(t.meetingId))
      ),
    [tasks, meetings]
  );

  const linkedDecisions = useMemo(
    () =>
      decisions.filter((d) =>
        meetings.some((m) => String(m.id) === String(d.meetingId))
      ),
    [decisions, meetings]
  );

  const stats = useMemo(() => {
    const done = linkedTasks.filter((t) => t.status === 'done').length;
    const completion =
      linkedTasks.length === 0
        ? 0
        : Math.round((done / linkedTasks.length) * 100);

    const byStatus = { todo: 0, in_progress: 0, done: 0, overdue: 0 };
    linkedTasks.forEach((t) => {
      byStatus[effectiveTaskStatus(t)] += 1;
    });

    const loadByUser = users.map((u) => ({
      ...u,
      open: linkedTasks.filter(
        (t) => t.assigneeId === u.id && effectiveTaskStatus(t) !== 'done'
      ).length,
    }));

    return { completion, byStatus, loadByUser };
  }, [linkedTasks, users]);

  const maxOpen = Math.max(...stats.loadByUser.map((u) => u.open), 1);

  return (
    <div className="page">
      <PageHeader
        title="Reports"
        subtitle="A clear snapshot of meetings, tasks, and ownership."
      />

      <StatsGrid
        items={[
          {
            label: 'Meetings',
            value: meetings.length,
            icon: <Icon name="meetings" className="h-4 w-4" />,
          },
          {
            label: 'Completed',
            value: meetings.filter((m) => m.status === 'completed').length,
            tone: 'success',
            icon: <Icon name="check" className="h-4 w-4" />,
          },
          {
            label: 'Task done',
            value: `${stats.completion}%`,
            tone: 'brand',
            icon: <Icon name="tasks" className="h-4 w-4" />,
          },
          {
            label: 'Decisions',
            value: linkedDecisions.length,
            icon: <Icon name="decisions" className="h-4 w-4" />,
          },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ListPanel title="Tasks by status" bodyClassName="p-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['To do', stats.byStatus.todo, 'text-amber-700'],
              ['In progress', stats.byStatus.in_progress, 'text-sky-700'],
              ['Done', stats.byStatus.done, 'text-emerald-700'],
              ['Overdue', stats.byStatus.overdue, 'text-red-700'],
            ].map(([label, value, tone]) => (
              <div
                key={label}
                className="rounded-xl border border-ink-100 bg-mist-50/80 px-4 py-3.5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  {label}
                </p>
                <p
                  className={`mt-1 font-display text-2xl font-semibold ${tone}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </ListPanel>

        <ListPanel title="Open tasks by person" bodyClassName="space-y-4 p-5">
          {stats.loadByUser.map((u) => (
            <div key={u.id}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-ink-800">{u.name}</span>
                <span className="tabular-nums text-ink-500">{u.open}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-700 to-sky-500 transition-all duration-500"
                  style={{ width: `${(u.open / maxOpen) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </ListPanel>
      </div>
    </div>
  );
}
