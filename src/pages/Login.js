import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    window.setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      navigate(from, { replace: true });
    }, 300);
  };

  return (
    <div className="h-screen overflow-hidden lg:grid lg:grid-cols-2">
      {/* Image side — full half */}
      <section className="relative hidden h-full overflow-hidden lg:block">
        <img
          src={`${process.env.PUBLIC_URL}/login-hero.png`}
          alt="Digital online meeting network"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/25 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
          <p className="font-display text-4xl font-semibold tracking-tight">
            BriefFlow
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Connect, decide, and follow up — an online workspace for modern meetings.
          </p>
        </div>
      </section>

      {/* Form side — fills the rest of the page */}
      <section className="relative flex h-full w-full flex-col bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),transparent_55%)]" />

        <div className="relative flex h-full w-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <p className="font-display text-3xl font-semibold tracking-tight text-ink-950 lg:hidden">
              BriefFlow
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-950">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Enter your username and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="input"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="label !mb-0" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="input"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full !py-3"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
