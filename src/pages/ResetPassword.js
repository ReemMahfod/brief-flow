import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ResetPassword() {
  const { isAuthenticated, resetPassword } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('briefflow-reset-email') || '';
    setEmail(saved);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your username.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    const result = resetPassword(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    sessionStorage.removeItem('briefflow-reset-email');
    setDone(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-ink-400/15 blur-3xl" />

      <div className="panel animate-rise w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 text-center">
          <p className="font-display text-3xl font-semibold tracking-tight text-ink-950">
            BriefFlow
          </p>
          <h1 className="mt-3 text-xl font-semibold text-ink-900">Reset password</h1>
          <p className="mt-1 text-sm text-ink-500">
            Choose a new password for your account.
          </p>
        </div>

        {done ? (
          <div className="space-y-4 text-center">
            <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
              Your password has been updated. You can sign in now.
            </p>
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => navigate('/login')}
            >
              Go to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                className="input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full">
              Update password
            </button>

            <Link to="/login" className="soft-link block text-center">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
