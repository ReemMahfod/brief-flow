export const USERS = [
  {
    id: 'u1',
    name: 'Sara Ahmed',
    role: 'manager',
    title: 'Operations Manager',
    email: 'sara@briefflow.com',
  },
  {
    id: 'u2',
    name: 'Mohammed Khalid',
    role: 'organizer',
    title: 'Meeting Organizer',
    email: 'mohammed@briefflow.com',
  },
  {
    id: 'u3',
    name: 'Layan Omar',
    role: 'employee',
    title: 'Product Specialist',
    email: 'layan@briefflow.com',
  },
  {
    id: 'u4',
    name: 'Yousef Nasser',
    role: 'employee',
    title: 'Frontend Developer',
    email: 'yousef@briefflow.com',
  },
  {
    id: 'u5',
    name: 'Noor Hassan',
    role: 'employee',
    title: 'Business Analyst',
    email: 'noor@briefflow.com',
  },
];

const today = new Date();
const iso = (offsetDays, hour = 10, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const initialMeetings = [
  {
    id: 'm1',
    title: 'Q3 Product Launch Review',
    description: 'Review launch readiness, risks, and customer communication plan.',
    date: iso(0, 10, 0),
    duration: 60,
    location: 'Innovation Room + meeting link',
    status: 'scheduled',
    organizerId: 'u2',
    attendeeIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
    agenda: [
      { id: 'a1', text: 'Feature readiness status', order: 1 },
      { id: 'a2', text: 'Launch risks and mitigation', order: 2 },
      { id: 'a3', text: 'External communication plan', order: 3 },
    ],
    notes: 'Focus on beta stability before the public launch.',
  },
  {
    id: 'm2',
    title: 'Weekly Sprint Planning',
    description: 'Assign weekly work and align priorities with the team.',
    date: iso(0, 14, 30),
    duration: 45,
    location: 'Team Room',
    status: 'scheduled',
    organizerId: 'u2',
    attendeeIds: ['u2', 'u3', 'u4'],
    agenda: [
      { id: 'a4', text: 'Backlog review', order: 1 },
      { id: 'a5', text: 'Effort estimates', order: 2 },
      { id: 'a6', text: 'Assign owners', order: 3 },
    ],
    notes: '',
  },
  {
    id: 'm3',
    title: 'Monthly Team Performance',
    description: 'Review KPIs, overdue work, and coaching actions.',
    date: iso(-2, 11, 0),
    duration: 75,
    location: 'Board Room',
    status: 'completed',
    organizerId: 'u1',
    attendeeIds: ['u1', 'u2', 'u3', 'u5'],
    agenda: [
      { id: 'a7', text: 'KPI dashboard', order: 1 },
      { id: 'a8', text: 'Overdue task review', order: 2 },
      { id: 'a9', text: 'Next-month targets', order: 3 },
    ],
    notes: 'Adopt weekly follow-up for overdue tasks.',
  },
  {
    id: 'm4',
    title: 'Design Sync',
    description: 'Align UI polish and handoff checklist for release.',
    date: iso(1, 13, 0),
    duration: 30,
    location: 'Online',
    status: 'scheduled',
    organizerId: 'u4',
    attendeeIds: ['u3', 'u4'],
    agenda: [
      { id: 'a10', text: 'Open UI issues', order: 1 },
      { id: 'a11', text: 'Handoff checklist', order: 2 },
    ],
    notes: '',
  },
  {
    id: 'm5',
    title: 'Budget Checkpoint',
    description: 'Approve remaining spend and defer non-critical tools.',
    date: iso(-5, 15, 0),
    duration: 50,
    location: 'Finance Room',
    status: 'completed',
    organizerId: 'u1',
    attendeeIds: ['u1', 'u5'],
    agenda: [
      { id: 'a12', text: 'Expense summary', order: 1 },
      { id: 'a13', text: 'Items needing approval', order: 2 },
    ],
    notes: 'Postpone marketing tools purchase until the current campaign ends.',
  },
];

export const initialDecisions = [
  {
    id: 'd1',
    meetingId: 'm3',
    text: 'Adopt weekly follow-up for overdue tasks in BriefFlow.',
    ownerId: 'u2',
    createdAt: iso(-2, 12, 0),
  },
  {
    id: 'd2',
    meetingId: 'm3',
    text: 'Raise on-time task completion target to 85% for next month.',
    ownerId: 'u1',
    createdAt: iso(-2, 12, 15),
  },
  {
    id: 'd3',
    meetingId: 'm5',
    text: 'Delay purchasing new marketing tools until end of quarter.',
    ownerId: 'u5',
    createdAt: iso(-5, 14, 0),
  },
];

export const initialTasks = [
  {
    id: 't1',
    title: 'Prepare launch risk matrix',
    description: '',
    assigneeId: 'u3',
    dueDate: iso(-1, 18, 0).slice(0, 10),
    priority: 'high',
    meetingId: 'm1',
    status: 'in_progress',
  },
  {
    id: 't2',
    title: 'Draft customer announcement',
    description: '',
    assigneeId: 'u5',
    dueDate: iso(2, 18, 0).slice(0, 10),
    priority: 'medium',
    meetingId: 'm1',
    status: 'todo',
  },
  {
    id: 't3',
    title: 'Close overdue sprint tickets',
    description: '',
    assigneeId: 'u4',
    dueDate: iso(-3, 18, 0).slice(0, 10),
    priority: 'high',
    meetingId: 'm3',
    status: 'todo',
  },
  {
    id: 't4',
    title: 'Share KPI summary with managers',
    description: '',
    assigneeId: 'u2',
    dueDate: iso(-1, 18, 0).slice(0, 10),
    priority: 'medium',
    meetingId: 'm3',
    status: 'done',
  },
  {
    id: 't5',
    title: 'Update budget tracker sheet',
    description: '',
    assigneeId: 'u5',
    dueDate: iso(1, 18, 0).slice(0, 10),
    priority: 'low',
    meetingId: 'm5',
    status: 'todo',
  },
  {
    id: 't6',
    title: 'Confirm deferred tool vendors',
    description: '',
    assigneeId: 'u1',
    dueDate: iso(-4, 18, 0).slice(0, 10),
    priority: 'medium',
    meetingId: 'm5',
    status: 'done',
  },
];

export const STATUS_LABELS = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
  overdue: 'Overdue',
};

export const ROLE_LABELS = {
  employee: 'Employee',
  organizer: 'Organizer',
  manager: 'Manager',
};
