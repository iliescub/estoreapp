  import { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  export default function SignupPage() {
    const { register, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        await register({ ...form, role: 'User' });
        navigate('/', { replace: true });
      } catch (err) {
        setError(err.response?.data ?? 'Unable to sign up.');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Join us to track orders and manage your cart anywhere.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500
  focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500
  focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
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
              <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={6}
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
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }