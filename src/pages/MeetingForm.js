import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import PageHeader from '../components/PageHeader';
import { Icon } from '../components/Icon';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '10:00',
  duration: 60,
  location: '',
  status: 'scheduled',
  organizerId: '',
  attendeeIds: [],
  agendaText: '',
  notes: '',
};

function emptyTask(assigneeId = '') {
  return {
    key: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    assigneeId,
    dueDate: '',
  };
}

function toLocalDateParts(iso) {
  const d = new Date(iso);
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toTimeString().slice(0, 5),
  };
}

export default function MeetingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { meetings, users, currentUser, addMeeting, updateMeeting } = useApp();
  const { notify } = useNotifications();
  const [form, setForm] = useState({
    ...emptyForm,
    organizerId: currentUser?.id || '',
    attendeeIds: currentUser?.id ? [currentUser.id] : [],
  });
  const [draftTasks, setDraftTasks] = useState([
    emptyTask(currentUser?.id || ''),
  ]);

  useEffect(() => {
    if (!isEdit) return;
    const meeting = meetings.find((m) => String(m.id) === String(id));
    if (!meeting) return;
    const { date, time } = toLocalDateParts(meeting.date);
    setForm({
      title: meeting.title,
      description: meeting.description,
      date,
      time,
      duration: meeting.duration,
      location: meeting.location,
      status: meeting.status,
      organizerId: meeting.organizerId,
      attendeeIds: meeting.attendeeIds,
      agendaText: meeting.agenda.map((a) => a.text).join('\n'),
      notes: meeting.notes || '',
    });
    setDraftTasks([emptyTask(meeting.organizerId || currentUser?.id || '')]);
  }, [id, isEdit, meetings, currentUser?.id]);

  const assigneeOptions =
    form.attendeeIds.length > 0
      ? users.filter((u) => form.attendeeIds.includes(u.id))
      : users;

  const toggleAttendee = (userId) => {
    setForm((prev) => ({
      ...prev,
      attendeeIds: prev.attendeeIds.includes(userId)
        ? prev.attendeeIds.filter((x) => x !== userId)
        : [...prev.attendeeIds, userId],
    }));
  };

  const updateDraftTask = (key, field, value) => {
    setDraftTasks((prev) =>
      prev.map((task) => (task.key === key ? { ...task, [field]: value } : task))
    );
  };

  const addDraftTask = () => {
    const fallback =
      form.attendeeIds[0] || form.organizerId || currentUser?.id || '';
    setDraftTasks((prev) => [...prev, emptyTask(fallback)]);
  };

  const removeDraftTask = (key) => {
    setDraftTasks((prev) =>
      prev.length <= 1 ? [emptyTask(form.organizerId || '')] : prev.filter((t) => t.key !== key)
    );
  };

  const saveReadyTasks = () =>
    draftTasks
      .filter((t) => t.title.trim() && t.dueDate && t.assigneeId)
      .map((t) => ({
        title: t.title.trim(),
        description: '',
        assigneeId: t.assigneeId,
        dueDate: t.dueDate,
        priority: 'medium',
        status: 'todo',
      }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateValue = new Date(`${form.date}T${form.time || '00:00'}:00`);
    if (Number.isNaN(dateValue.getTime())) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: dateValue.toISOString(),
      duration: Number(form.duration) || 60,
      location: form.location.trim(),
      status: form.status,
      organizerId: form.organizerId || currentUser?.id || users[0]?.id,
      attendeeIds:
        form.attendeeIds.length > 0
          ? form.attendeeIds
          : [form.organizerId || currentUser?.id || users[0]?.id],
      agenda: form.agendaText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((text) => ({ text })),
      notes: form.notes,
    };

    const readyTasks = saveReadyTasks();

    if (isEdit) {
      updateMeeting(id, payload, readyTasks);
      notify({
        title: 'Meeting updated',
        message: `"${payload.title}" was saved successfully.`,
        type: 'info',
        sound: true,
      });
      navigate(`/meetings/${id}`);
    } else {
      const meetingId = addMeeting(payload, readyTasks);
      notify({
        title: 'New meeting created',
        message: `"${payload.title}" is now in your meetings list.`,
        type: 'success',
        sound: true,
      });
      navigate(`/meetings/${meetingId}`);
    }
  };

  return (
    <div className="page mx-auto max-w-2xl">
      <PageHeader title={isEdit ? 'Edit meeting' : 'New meeting'} />
      <Link
        to={isEdit ? `/meetings/${id}` : '/meetings'}
        className="soft-link inline-block"
      >
        ← Back
      </Link>

      <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-[80px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Time</label>
            <input
              type="time"
              className="input"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Duration (min)</label>
            <input
              type="number"
              min="15"
              className="input"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <input
            className="input"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Organizer</label>
          <select
            className="input"
            value={form.organizerId}
            onChange={(e) => setForm({ ...form, organizerId: e.target.value })}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Attendees</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {users.map((u) => (
              <label
                key={u.id}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-mist-50 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={form.attendeeIds.includes(u.id)}
                  onChange={() => toggleAttendee(u.id)}
                />
                {u.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Agenda (one item per line)</label>
          <textarea
            className="input min-h-[100px]"
            placeholder={'Item 1\nItem 2'}
            value={form.agendaText}
            onChange={(e) => setForm({ ...form, agendaText: e.target.value })}
          />
        </div>

        <div className="space-y-3 border-t border-ink-100 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="label !mb-0">Tasks</p>
              <p className="mt-1 text-xs text-ink-500">
                Assign one or more follow-ups to attendees.
                {isEdit ? ' New tasks below will be added on save.' : ''}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary !py-1.5 !text-xs"
              onClick={addDraftTask}
            >
              <Icon name="plus" className="h-3.5 w-3.5" />
              Add task
            </button>
          </div>

          <div className="space-y-3">
            {draftTasks.map((task, index) => (
              <div
                key={task.key}
                className="space-y-2 rounded-xl border border-ink-100 bg-mist-50/80 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Task {index + 1}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => removeDraftTask(task.key)}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="input"
                  placeholder="Task title"
                  value={task.title}
                  onChange={(e) =>
                    updateDraftTask(task.key, 'title', e.target.value)
                  }
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    className="input"
                    value={task.assigneeId}
                    onChange={(e) =>
                      updateDraftTask(task.key, 'assigneeId', e.target.value)
                    }
                  >
                    <option value="">Assign to...</option>
                    {assigneeOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="input"
                    value={task.dueDate}
                    onChange={(e) =>
                      updateDraftTask(task.key, 'dueDate', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save' : 'Create'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(isEdit ? `/meetings/${id}` : '/meetings')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
