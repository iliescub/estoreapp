     import { useState } from 'react';
     import { useAuth } from '../context/AuthContext';
     import { usersAPI } from '../services/api';

     export default function ProfilePage() {
       const { user, logout, register, refreshProfile } = useAuth(); // register unused, but keep if needed elsewhere
       const [form, setForm] = useState({
         firstName: user?.firstName ?? '',
         lastName: user?.lastName ?? '',
         email: user?.email ?? '',
         newPassword: '',
         confirmPassword: '',
       });
       const [saving, setSaving] = useState(false);
       const [message, setMessage] = useState('');
       const [error, setError] = useState('');

       if (!user) {
         return <p className="p-8 text-center">Please sign in to manage your profile.</p>;
       }

       const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

       const handleSubmit = async (e) => {
         e.preventDefault();
         setMessage('');
         setError('');

         if (form.newPassword && form.newPassword !== form.confirmPassword) {
           setError('Passwords do not match.');
           return;
         }

         setSaving(true);
         try {
           await usersAPI.updateMe({
             firstName: form.firstName.trim(),
             lastName: form.lastName.trim(),
             email: form.email.trim(),
             newPassword: form.newPassword ? form.newPassword : undefined,
           });
            await refreshProfile(); // <-- call the AuthContext helper here
         
           setMessage('Profile updated successfully.');
           setForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
         } catch (err) {
           setError(err.response?.data ?? 'Unable to update profile.');
         } finally {
           setSaving(false);
         }
       };
       

       return (
         <section className="container mx-auto max-w-2xl px-4 py-10">
           <h1 className="text-3xl font-bold text-slate-900">Account settings</h1>
           <p className="text-slate-600">Keep your personal information up to date.</p>

           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
             <div className="grid gap-4 md:grid-cols-2">
               <label className="text-sm font-medium text-slate-700">
                 First name
                 <input
                   className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5"
                   name="firstName"
                   value={form.firstName}
                   onChange={handleChange}
                   required
                 />
               </label>
               <label className="text-sm font-medium text-slate-700">
                 Last name
                 <input
                   className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5"
                   name="lastName"
                   value={form.lastName}
                   onChange={handleChange}
                   required
                 />
               </label>
             </div>

             <label className="text-sm font-medium text-slate-700">
               Email
               <input
                 className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5"
                 type="email"
                 name="email"
                 value={form.email}
                 onChange={handleChange}
                 required
               />
             </label>

             <div className="grid gap-4 md:grid-cols-2">
               <label className="text-sm font-medium text-slate-700">
                 New password
                 <input
                   className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5"
                   type="password"
                   name="newPassword"
                   value={form.newPassword}
                   onChange={handleChange}
                   minLength={6}
                   placeholder="Leave blank to keep current"
                 />
               </label>
               <label className="text-sm font-medium text-slate-700">
                 Confirm new password
                 <input
                   className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5"
                   type="password"
                   name="confirmPassword"
                   value={form.confirmPassword}
                   onChange={handleChange}
                   minLength={6}
                 />
               </label>
             </div>

             {error && <p className="rounded bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
             {message && <p className="rounded bg-green-50 px-4 py-2 text-sm text-green-700">{message}</p>}

             <button
               type="submit"
               disabled={saving}
               className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
             >
               {saving ? 'Saving…' : 'Save changes'}
             </button>
           </form>
         </section>
       );
     }
