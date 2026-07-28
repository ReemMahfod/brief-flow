import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ForgotPassword() {
  const { isAuthenticated } = useApp();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    sessionStorage.setItem('briefflow-reset-email', username.trim());
    setSent(true);
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
          <h1 className="mt-3 text-xl font-semibold text-ink-900">Forgot password</h1>
          <p className="mt-1 text-sm text-ink-500">
            Enter your username and continue to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
              Reset is ready for <strong>{username.trim()}</strong>.
            </p>
            <Link to="/reset-password" className="btn-primary w-full">
              Continue to reset password
            </Link>
            <Link to="/login" className="soft-link block">
              Back to sign in
            </Link>
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
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full">
              Continue
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
