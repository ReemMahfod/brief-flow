import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import TaskRow from '../components/TaskRow';
import ListPanel from '../components/ListPanel';
import EmptyState from '../components/EmptyState';
import { formatDate, sortByNewest } from '../utils/helpers';

function makeDraftTask(assigneeId = '') {
  return {
    key: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    assigneeId,
    dueDate: '',
  };
}

export default function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    meetings,
    tasks,
    decisions,
    users,
    getUser,
    currentUser,
    updateMeeting,
    deleteMeeting,
    addTasks,
    addDecision,
    deleteDecision,
  } = useApp();

  const meeting = meetings.find((m) => String(m.id) === String(id));
  const [decisionText, setDecisionText] = useState('');
  const [notes, setNotes] = useState('');
  const [draftTasks, setDraftTasks] = useState([
    makeDraftTask(currentUser?.id || ''),
  ]);

  useEffect(() => {
    setNotes(meeting?.notes || '');
  }, [id, meeting?.notes]);

  useEffect(() => {
    if (!currentUser?.id) return;
    setDraftTasks((prev) =>
      prev.map((t, i) =>
        i === 0 && !t.assigneeId ? { ...t, assigneeId: currentUser.id } : t
      )
    );
  }, [currentUser?.id]);

  const meetingTasks = useMemo(
    () =>
      sortByNewest(
        tasks.filter((t) => String(t.meetingId) === String(id)),
        'dueDate'
      ),
    [tasks, id]
  );
  const meetingDecisions = useMemo(
    () =>
      sortByNewest(
        decisions.filter((d) => String(d.meetingId) === String(id)),
        'createdAt'
      ),
    [decisions, id]
  );

  if (!meeting) {
    return (
      <div className="panel">
        <EmptyState
          title="Meeting not found"
          description="It may have been deleted."
          actionLabel="Back to meetings"
          actionTo="/meetings"
        />
      </div>
    );
  }

  const attendees = meeting.attendeeIds.map((uid) => getUser(uid)).filter(Boolean);
  const assigneePool = attendees.length > 0 ? attendees : users;

  const handleAddDecision = (e) => {
    e.preventDefault();
    if (!decisionText.trim()) return;
    addDecision({
      meetingId: String(id),
      text: decisionText.trim(),
      ownerId: currentUser?.id,
    });
    setDecisionText('');
  };

  const updateDraft = (key, field, value) => {
    setDraftTasks((prev) =>
      prev.map((t) => (t.key === key ? { ...t, [field]: value } : t))
    );
  };

  const handleAddTasks = (e) => {
    e.preventDefault();
    const ready = draftTasks.filter(
      (t) => t.title.trim() && t.dueDate && t.assigneeId
    );
    if (ready.length === 0) return;

    addTasks(
      ready.map((t) => ({
        title: t.title.trim(),
        description: '',
        assigneeId: t.assigneeId,
        dueDate: t.dueDate,
        priority: 'medium',
        meetingId: String(id),
        status: 'todo',
      }))
    );

    setDraftTasks([makeDraftTask(currentUser?.id || assigneePool[0]?.id || '')]);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Delete this meeting? All tasks and decisions for this meeting will be deleted too.'
      )
    ) {
      deleteMeeting(String(id));
      navigate('/meetings');
    }
  };

  return (
    <div className="page">
      <PageHeader
        title={meeting.title}
        subtitle={meeting.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={`/meetings/${id}/edit`} className="btn-secondary">
              Edit
            </Link>
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        }
      />

      <div className="panel flex flex-wrap items-center gap-3 px-5 py-3.5 text-sm text-ink-600">
        <Link to="/meetings" className="soft-link">
          ← Back
        </Link>
        <StatusBadge value={meeting.status} />
        <span>{formatDate(meeting.date)}</span>
        <span>· {meeting.duration} min</span>
        <span>· {meeting.location}</span>
        <select
          className="ml-auto rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs"
          value={meeting.status}
          onChange={(e) => updateMeeting(id, { status: e.target.value })}
          aria-label="Meeting status"
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ListPanel title="Agenda" bodyClassName="p-5">
            {meeting.agenda.length === 0 ? (
              <p className="text-sm text-ink-500">No agenda items</p>
            ) : (
              <ol className="space-y-2.5">
                {meeting.agenda.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm text-ink-800">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-950 text-[11px] font-semibold text-white">
                      {item.order}
                    </span>
                    <span className="pt-0.5">{item.text}</span>
                  </li>
                ))}
              </ol>
            )}
          </ListPanel>
        </div>

        <ListPanel title="Attendees" bodyClassName="space-y-2 p-5">
          {attendees.map((u) => (
            <div
              key={u.id}
              className="rounded-xl bg-mist-50 px-3 py-2 text-sm text-ink-800"
            >
              {u.name}
            </div>
          ))}
        </ListPanel>
      </div>

      <ListPanel title="Notes" bodyClassName="p-5">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            className="btn-secondary !py-1.5 !text-xs"
            onClick={() => updateMeeting(id, { notes })}
          >
            Save notes
          </button>
        </div>
        <textarea
          className="input min-h-[100px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write notes here..."
        />
      </ListPanel>

      <ListPanel title="Decisions" bodyClassName="p-5">
        <form onSubmit={handleAddDecision} className="mb-4 flex gap-2">
          <input
            className="input"
            placeholder="Add a decision..."
            value={decisionText}
            onChange={(e) => setDecisionText(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0">
            Add
          </button>
        </form>
        {meetingDecisions.length === 0 ? (
          <p className="text-sm text-ink-500">No decisions yet</p>
        ) : (
          <ul className="space-y-2.5">
            {meetingDecisions.map((d) => (
              <li
                key={d.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-mist-50 px-3 py-2.5 text-sm"
              >
                <span>
                  {d.text}
                  <span className="mt-0.5 block text-xs text-ink-500">
                    {getUser(d.ownerId)?.name}
                  </span>
                </span>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600 hover:underline"
                  onClick={() => deleteDecision(d.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </ListPanel>

      <ListPanel title="Tasks" bodyClassName="p-5">
        <form onSubmit={handleAddTasks} className="mb-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-ink-500">
              Add several tasks, then save them together.
            </p>
            <button
              type="button"
              className="btn-secondary !py-1.5 !text-xs"
              onClick={() =>
                setDraftTasks((prev) => [
                  ...prev,
                  makeDraftTask(currentUser?.id || assigneePool[0]?.id || ''),
                ])
              }
            >
              Add another
            </button>
          </div>

          {draftTasks.map((task, index) => (
            <div
              key={task.key}
              className="grid gap-2 rounded-xl border border-ink-100 bg-mist-50/70 p-3 sm:grid-cols-[1fr_160px_140px_auto]"
            >
              <input
                className="input"
                placeholder={`Task ${index + 1} title`}
                value={task.title}
                onChange={(e) => updateDraft(task.key, 'title', e.target.value)}
              />
              <select
                className="input"
                value={task.assigneeId}
                onChange={(e) =>
                  updateDraft(task.key, 'assigneeId', e.target.value)
                }
              >
                {assigneePool.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="input"
                value={task.dueDate}
                onChange={(e) => updateDraft(task.key, 'dueDate', e.target.value)}
              />
              <button
                type="button"
                className="text-xs font-semibold text-red-600 hover:underline sm:px-1"
                onClick={() =>
                  setDraftTasks((prev) =>
                    prev.length <= 1
                      ? [
                          makeDraftTask(
                            currentUser?.id || assigneePool[0]?.id || ''
                          ),
                        ]
                      : prev.filter((t) => t.key !== task.key)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}

          <button type="submit" className="btn-primary">
            Save tasks
          </button>
        </form>

        {meetingTasks.length === 0 ? (
          <p className="text-sm text-ink-500">No tasks yet</p>
        ) : (
          <div className="space-y-2.5">
            {meetingTasks.map((t) => (
              <TaskRow key={t.id} task={t} showMeeting={false} />
            ))}
          </div>
        )}
      </ListPanel>
    </div>
  );
}
