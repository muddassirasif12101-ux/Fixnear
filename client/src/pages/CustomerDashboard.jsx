import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

function CustomerDashboard() {
  const { api, logout, user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/users/me');
        setProfile(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [api, user]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Customer dashboard</h1>
            <p className="mt-3 text-slate-600">Manage your bookings, profile and service requests.</p>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
        {loading ? (
          <p className="mt-6 text-slate-600">Loading profile...</p>
        ) : profile ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-accent">My profile</p>
            <p className="mt-4 text-xl font-semibold text-slate-900">{profile.name}</p>
            <p className="mt-2 text-slate-600">{profile.email}</p>
            <p className="mt-2 text-slate-500">Role: {profile.role}</p>
          </div>
        ) : (
          <p className="mt-6 text-red-600">Unable to load profile.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
