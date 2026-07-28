export function formatDate(value, withTime = true) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';

  const date = d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (!withTime || /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return date;
  }

  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

export function isSameDay(a, b = new Date()) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function endOfDay(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    d.setHours(23, 59, 59, 999);
  }
  return d;
}

export function isOverdue(task) {
  if (task.status === 'done') return false;
  if (task.status === 'overdue') return true;
  const due = endOfDay(task.dueDate);
  if (!due) return false;
  return due < new Date();
}

export function effectiveTaskStatus(task) {
  if (task.status === 'done') return 'done';
  if (isOverdue(task)) return 'overdue';
  return task.status;
}

export function sortByNewest(items, field) {
  return [...items].sort(
    (a, b) => new Date(b[field]).getTime() - new Date(a[field]).getTime()
  );
}
