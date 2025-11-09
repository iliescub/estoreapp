  import { useMemo, useState } from 'react';
  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
  import { Navigate } from 'react-router-dom';
  import { adminUsersAPI } from '../services/api';
  import { useAuth } from '../context/AuthContext';

  const ROLE_OPTIONS = ['User', 'Admin'];
  const STATUS_OPTIONS = ['Active', 'Inactive', 'Blocked'];

  export default function AdminUsersPage() {
    const { user, isAdmin } = useAuth();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      role: 'User',
      status: 'Active',
      newPassword: '',
    });
    const [modalError, setModalError] = useState('');

    const { data, isLoading, isError, error } = useQuery({
      queryKey: ['admin-users'],
      queryFn: adminUsersAPI.getAll,
      enabled: Boolean(user && isAdmin),
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, payload }) => adminUsersAPI.update(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
        closeModal();
      },
      onError: (err) => setModalError(err.response?.data ?? 'Unable to update user.'),
    });

    const deleteMutation = useMutation({
      mutationFn: adminUsersAPI.delete,
      onSuccess: () => queryClient.invalidateQueries(['admin-users']),
    });

    if (!user) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    const filtered = useMemo(() => {
      if (!data) return [];
      const term = search.trim().toLowerCase();
      if (!term) return data;
      return data.filter(
        (u) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }, [data, search]);

    const openModal = (u) => {
      setEditingUser(u);
      setForm({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        status: u.status,
        newPassword: '',
      });
      setModalError('');
    };

    const closeModal = () => {
      setEditingUser(null);
      setForm({ firstName: '', lastName: '', email: '', role: 'User', status: 'Active', newPassword: '' });
      setModalError('');
    };

    const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!editingUser) return;
      if (form.role !== 'Admin' && editingUser.id === user.id) {
        setModalError('You cannot demote yourself.');
        return;
      }
      updateMutation.mutate({
        id: editingUser.id,
        payload: {
          userId: editingUser.id,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          role: form.role,
          userStatus: form.status,
          newPassword: form.newPassword || undefined,
        },
      });
    };

    const handleDelete = (id) => {
      if (id === user.id) {
        alert('You cannot delete your own account.');
        return;
      }
      if (confirm('Delete this user? This action cannot be undone.')) {
        deleteMutation.mutate(id);
      }
    };

    const handleToggleStatus = (u) => {
      const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
      updateMutation.mutate({
        id: u.id,
        payload: {
          userId: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          role: u.role,
          userStatus: nextStatus,
        },
      });
    };

    return (
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600">Create, edit, or deactivate customer accounts.</p>
          </div>
          <input
            type="search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline- none"
          />
        </header>

        <div className="mt-8 rounded-2xl bg-white shadow ring-1 ring-slate-100">
          {isLoading && <p className="p-6 text-center">Loading users…</p>}
          {isError && <p className="p-6 text-center text-red-600">{error?.message ?? 'Unable to fetch users.'}</p>}
          {!isLoading && !isError && (
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate- 700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          u.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : u.status === 'Blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(u)} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                      <button onClick={() => handleToggleStatus(u)} className="text-amber-600 hover:text-amber-800">
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {editingUser && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <header className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Edit user</h2>
                  <p className="text-sm text-slate-500">{editingUser.email}</p>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  ×
                </button>
              </header>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    First name
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Last name
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                </div>

                <label className="text-sm font-medium text-slate-700">
                  Email
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Role
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                      name="role"
                      value={form.role}
                      onChange={handleFormChange}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Status
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="text-sm font-medium text-slate-700">
                  New password
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                    type="password"
                    name="newPassword"
                    minLength={6}
                    placeholder="Leave blank to keep current"
                    value={form.newPassword}
                    onChange={handleFormChange}
                  />
                </label>

                {modalError && <p className="rounded bg-red-50 px-4 py-2 text-sm text-red-600">{modalError}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {updateMutation.isLoading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  }
