import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';

export default function MeetingCard({ meeting }) {
  const { getUser } = useApp();
  const organizer = getUser(meeting.organizerId);
  const day = new Date(meeting.date);
  const time = day.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const attendees = meeting.attendeeIds?.length || 0;

  return (
    <Link
      to={`/meetings/${meeting.id}`}
      className="group flex gap-4 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-300/80 hover:shadow-lift"
    >
      <div className="flex h-[4.5rem] w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-ink-950 text-white transition duration-300 group-hover:bg-brand-700">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 group-hover:text-brand-100">
          {day.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="mt-0.5 font-display text-2xl font-semibold leading-none">
          {Number.isNaN(day.getDate()) ? '—' : day.getDate()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-display text-[1.05rem] font-semibold tracking-tight text-ink-950">
            {meeting.title}
          </h3>
          <StatusBadge value={meeting.status} />
        </div>
        {meeting.description && (
          <p className="mt-1 text-sm leading-relaxed text-ink-500 line-clamp-1">
            {meeting.description}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="h-3.5 w-3.5 text-ink-400" />
            {time} · {meeting.duration} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="users" className="h-3.5 w-3.5 text-ink-400" />
            {attendees} attendee{attendees === 1 ? '' : 's'}
          </span>
          {organizer && <span>{organizer.name}</span>}
        </div>
      </div>
    </Link>
  );
}
