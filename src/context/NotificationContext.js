import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { playBellSound } from '../utils/sound';

const NotificationContext = createContext(null);

let nextId = 1;

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    ({ title, message, type = 'success', sound = true }) => {
      const id = nextId++;
      const entry = {
        id,
        title,
        message,
        type,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setItems((prev) => [entry, ...prev].slice(0, 30));
      setToasts((prev) => [...prev, entry]);

      if (sound) playBellSound();

      window.setTimeout(() => dismissToast(id), 4200);
      return id;
    },
    [dismissToast]
  );

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  const value = {
    items,
    toasts,
    unreadCount,
    notify,
    dismissToast,
    markAllRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}
