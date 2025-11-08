 import { useState } from 'react';
  import { Link, useNavigate, useLocation } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  export default function LoginPage() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        await login(form.email, form.password);
        const redirectTo = location.state?.from?.pathname ?? '/';
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setError(err.response?.data ?? 'Unable to sign in.');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue shopping.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2
  focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:ring-2
  focus:ring-blue-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-
  60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No account yet?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    );
  }