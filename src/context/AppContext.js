import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  USERS,
  initialDecisions,
  initialMeetings,
  initialTasks,
} from '../data/mockData';

const STORAGE_KEY = 'briefflow-data-v4-en';
const AUTH_KEY = 'briefflow-auth-v1';
const LEGACY_STORAGE_KEYS = ['briefflow-data-v3-en', 'briefflow-data-v2-en'];

const AppContext = createContext(null);

function sameId(a, b) {
  return String(a ?? '') === String(b ?? '');
}

function sanitizeState({ meetings, tasks, decisions }) {
  const meetingIds = new Set((meetings || []).map((m) => String(m.id)));
  return {
    meetings: meetings || [],
    tasks: (tasks || []).filter((t) => meetingIds.has(String(t.meetingId))),
    decisions: (decisions || []).filter((d) =>
      meetingIds.has(String(d.meetingId))
    ),
  };
}

function defaultState() {
  return sanitizeState({
    meetings: initialMeetings,
    tasks: initialTasks,
    decisions: initialDecisions,
  });
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      return { isAuthenticated: false, currentUserId: null, displayName: '' };
    }
    const parsed = JSON.parse(raw);
    if (!parsed.isAuthenticated) {
      return { isAuthenticated: false, currentUserId: null, displayName: '' };
    }
    return {
      isAuthenticated: true,
      currentUserId: parsed.currentUserId || 'u2',
      displayName: parsed.displayName || '',
    };
  } catch {
    return { isAuthenticated: false, currentUserId: null, displayName: '' };
  }
}

function loadState() {
  const parsed =
    readStorage(STORAGE_KEY) ||
    LEGACY_STORAGE_KEYS.map(readStorage).find(Boolean);

  if (!parsed) return defaultState();

  return sanitizeState({
    meetings: parsed.meetings ?? initialMeetings,
    tasks: parsed.tasks ?? initialTasks,
    decisions: parsed.decisions ?? initialDecisions,
  });
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function saveState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [auth, setAuth] = useState(loadAuth);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  const commit = (updater) => {
    setState((prev) => {
      const draft = typeof updater === 'function' ? updater(prev) : updater;
      return sanitizeState(draft);
    });
  };

  const currentUser = useMemo(() => {
    if (!auth.isAuthenticated) return null;

    const matched = USERS.find((u) => u.id === auth.currentUserId);
    if (matched) {
      return {
        ...matched,
        name: auth.displayName?.trim() || matched.name,
      };
    }

    return {
      id: 'guest',
      name: auth.displayName?.trim() || 'Guest User',
      role: 'employee',
      title: 'Team Member',
      email: '',
    };
  }, [auth]);

  const getUser = (id) => USERS.find((u) => u.id === id);

  const login = (username, password) => {
    const name = username.trim();
    if (!name || !password.trim()) {
      return {
        ok: false,
        message: 'Please enter username and password.',
      };
    }

    const normalized = name.toLowerCase();
    const existing = USERS.find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.name.toLowerCase() === normalized
    );

    setAuth({
      isAuthenticated: true,
      currentUserId: existing?.id || 'u2',
      displayName: existing?.name || name,
    });

    return { ok: true };
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, currentUserId: null, displayName: '' });
  };

  const resetPassword = (username, newPassword) => {
    if (!username.trim()) {
      return { ok: false, message: 'Please enter your username.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' };
    }
    return { ok: true };
  };

  const addMeeting = (meeting, tasksToAdd = []) => {
    const newMeeting = {
      ...meeting,
      id: uid('m'),
      agenda: (meeting.agenda || []).map((item, index) => ({
        id: uid('a'),
        text: item.text,
        order: index + 1,
      })),
      notes: meeting.notes || '',
    };

    const meetingId = String(newMeeting.id);
    const newTasks = (tasksToAdd || []).map((task) => ({
      ...task,
      id: uid('t'),
      meetingId,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
    }));

    commit((prev) => ({
      ...prev,
      meetings: [newMeeting, ...prev.meetings],
      tasks: [...newTasks, ...prev.tasks],
    }));

    return meetingId;
  };

  const updateMeeting = (id, updates, tasksToAdd = []) => {
    const meetingId = String(id);
    const newTasks = (tasksToAdd || []).map((task) => ({
      ...task,
      id: uid('t'),
      meetingId,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
    }));

    commit((prev) => ({
      ...prev,
      meetings: prev.meetings.map((m) =>
        sameId(m.id, meetingId)
          ? {
              ...m,
              ...updates,
              id: meetingId,
              agenda: (updates.agenda || m.agenda).map((item, index) => ({
                id: item.id || uid('a'),
                text: item.text,
                order: index + 1,
              })),
            }
          : m
      ),
      tasks: newTasks.length ? [...newTasks, ...prev.tasks] : prev.tasks,
    }));
  };

  const deleteMeeting = (id) => {
    const meetingId = String(id);

    commit((prev) => ({
      meetings: prev.meetings.filter((m) => !sameId(m.id, meetingId)),
      tasks: prev.tasks.filter((t) => !sameId(t.meetingId, meetingId)),
      decisions: prev.decisions.filter((d) => !sameId(d.meetingId, meetingId)),
    }));
  };

  const addTasks = (taskList) => {
    if (!taskList?.length) return [];
    const created = taskList.map((task) => ({
      ...task,
      id: uid('t'),
      meetingId: String(task.meetingId),
    }));
    commit((prev) => ({ ...prev, tasks: [...created, ...prev.tasks] }));
    return created.map((t) => t.id);
  };

  const updateTask = (id, updates) => {
    commit((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        sameId(t.id, id) ? { ...t, ...updates } : t
      ),
    }));
  };

  const addDecision = (decision) => {
    const newDecision = {
      ...decision,
      id: uid('d'),
      meetingId: String(decision.meetingId),
      createdAt: new Date().toISOString(),
    };
    commit((prev) => ({
      ...prev,
      decisions: [newDecision, ...prev.decisions],
    }));
    return newDecision.id;
  };

  const deleteDecision = (id) => {
    commit((prev) => ({
      ...prev,
      decisions: prev.decisions.filter((d) => !sameId(d.id, id)),
    }));
  };

  const value = {
    users: USERS,
    meetings: state.meetings,
    tasks: state.tasks,
    decisions: state.decisions,
    currentUser,
    isAuthenticated: auth.isAuthenticated,
    getUser,
    login,
    logout,
    resetPassword,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addTasks,
    updateTask,
    addDecision,
    deleteDecision,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
