import StatusBadge from './StatusBadge';
import { Icon } from './Icon';
import { formatDate, effectiveTaskStatus } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export default function TaskRow({ task, showMeeting = true }) {
  const { getUser, meetings, updateTask } = useApp();
  const assignee = getUser(task.assigneeId);
  const meeting = meetings.find((m) => String(m.id) === String(task.meetingId));
  const status = effectiveTaskStatus(task);
  const late = status === 'overdue';
  const done = status === 'done';

  const initials = (assignee?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border px-3.5 py-3.5 transition sm:flex-row sm:items-center sm:gap-4 ${
        late
          ? 'border-red-200/80 bg-red-50/80'
          : done
            ? 'border-ink-100 bg-ink-50/40'
            : 'border-ink-100 bg-white hover:border-ink-200'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          late
            ? 'bg-red-100 text-red-700'
            : done
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-brand-50 text-brand-700'
        }`}
        title={assignee?.name}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-semibold text-ink-900 ${
              done ? 'line-through decoration-ink-300' : ''
            }`}
          >
            {task.title}
          </p>
          <StatusBadge value={status} />
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Icon name="users" className="h-3.5 w-3.5 text-ink-400" />
            {assignee?.name || 'Unassigned'}
          </span>
          <span
            className={`inline-flex items-center gap-1 ${
              late ? 'font-semibold text-red-600' : ''
            }`}
          >
            <Icon name="clock" className="h-3.5 w-3.5" />
            Due {formatDate(task.dueDate, false)}
          </span>
          {showMeeting && meeting && (
            <span className="inline-flex max-w-[14rem] items-center gap-1 truncate">
              <Icon name="meetings" className="h-3.5 w-3.5 shrink-0 text-ink-400" />
              {meeting.title}
            </span>
          )}
        </div>
      </div>

      <select
        className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-700 outline-none transition hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 sm:w-auto sm:min-w-[8.75rem]"
        value={task.status === 'overdue' ? 'todo' : task.status}
        onChange={(e) => updateTask(task.id, { status: e.target.value })}
        aria-label="Task status"
      >
        <option value="todo">To do</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
