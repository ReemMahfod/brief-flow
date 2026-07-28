import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MeetingCard from '../components/MeetingCard';
import PageHeader from '../components/PageHeader';
import StatsGrid from '../components/StatsGrid';
import ListPanel from '../components/ListPanel';
import TaskRow from '../components/TaskRow';
import { Icon } from '../components/Icon';
import { effectiveTaskStatus, isSameDay, sortByNewest } from '../utils/helpers';

export default function Dashboard() {
  const { meetings, tasks, decisions } = useApp();

  const linkedTasks = tasks.filter((t) =>
    meetings.some((m) => String(m.id) === String(t.meetingId))
  );

  const todayMeetings = sortByNewest(
    meetings.filter((m) => isSameDay(m.date) && m.status !== 'cancelled'),
    'date'
  );

  const overdueTasks = sortByNewest(
    linkedTasks.filter((t) => effectiveTaskStatus(t) === 'overdue'),
    'dueDate'
  );
  const openTasks = linkedTasks.filter((t) => t.status !== 'done');
  const doneTasks = linkedTasks.filter((t) => t.status === 'done');
  const progress =
    linkedTasks.length === 0
      ? 0
      : Math.round((doneTasks.length / linkedTasks.length) * 100);

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle={`${todayLabel} — overview of meetings and follow-ups.`}
        actions={
          <Link to="/meetings/new" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            New meeting
          </Link>
        }
      />

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Progress
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-950">
              {progress}% of tasks complete
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {doneTasks.length} done · {openTasks.length} open
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full origin-left rounded-full bg-gradient-to-r from-brand-700 to-sky-500 animate-grow"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <StatsGrid
        items={[
          {
            label: 'Today',
            value: todayMeetings.length,
            hint: 'Meetings scheduled',
            icon: <Icon name="meetings" className="h-4 w-4" />,
            tone: 'brand',
          },
          {
            label: 'Overdue',
            value: overdueTasks.length,
            hint: 'Need attention',
            icon: <Icon name="alert" className="h-4 w-4" />,
            tone: overdueTasks.length ? 'alert' : 'default',
          },
          {
            label: 'Open tasks',
            value: openTasks.length,
            hint: 'Across meetings',
            icon: <Icon name="tasks" className="h-4 w-4" />,
          },
          {
            label: 'Decisions',
            value: decisions.filter((d) =>
              meetings.some((m) => String(m.id) === String(d.meetingId))
            ).length,
            hint: 'Recorded outcomes',
            icon: <Icon name="decisions" className="h-4 w-4" />,
            tone: 'success',
          },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ListPanel
          title="Today’s meetings"
          actionLabel="View all"
          actionTo="/meetings"
          isEmpty={todayMeetings.length === 0}
          emptyTitle="No meetings today"
          emptyDescription="Create a meeting or browse the full calendar."
          emptyActionLabel="New meeting"
          emptyActionTo="/meetings/new"
          bodyClassName="space-y-3 p-4"
        >
          {todayMeetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </ListPanel>

        <ListPanel
          title="Overdue tasks"
          actionLabel="View all"
          actionTo="/tasks"
          isEmpty={overdueTasks.length === 0}
          emptyTitle="Nothing overdue"
          emptyDescription="All tasks are on track."
          bodyClassName="space-y-2.5 p-4"
        >
          {overdueTasks.slice(0, 5).map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </ListPanel>
      </div>
    </div>
  );
}
