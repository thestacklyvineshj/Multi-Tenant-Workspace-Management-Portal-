import { useMemo, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ROLE_ACTIONS } from '../constants/rbac';
import { exportActivitiesCsv, formatDate } from '../utils/helpers';

export function ActivityPage() {
  const { state, session } = useAppContext();
  const role = session?.role ?? 'viewer';
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'auth' | 'dashboard' | 'users' | 'projects' | 'activity'>('all');
  const canExport = ROLE_ACTIONS[role].canExportActivities;

  const filtered = useMemo(
    () =>
      state.activities.filter((activity) => {
        const user = state.users.find((u) => u.id === activity.userId);
        const searchText = `${user?.name ?? activity.userId} ${activity.action}`.toLowerCase();
        const matchesSearch = searchText.includes(search.toLowerCase());
        const matchesModule = moduleFilter === 'all' || activity.module === moduleFilter;
        return matchesSearch && matchesModule;
      }),
    [moduleFilter, search, state.activities, state.users],
  );

  if (!session) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Activity Tracking</h3>
      </div>
      <div className="grid gap-3 rounded-lg bg-white p-4 dark:bg-slate-900 md:grid-cols-3">
        <input className="rounded border px-3 py-2" placeholder="Search actions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded border px-3 py-2" value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as 'all' | 'auth' | 'dashboard' | 'users' | 'projects' | 'activity')}>
          <option value="all">All Modules</option><option value="auth">Auth</option><option value="dashboard">Dashboard</option><option value="users">Users</option><option value="projects">Projects</option><option value="activity">Activity</option>
        </select>
        {canExport && <button onClick={() => exportActivitiesCsv(filtered)} className="rounded bg-emerald-600 px-3 py-2 text-white">Export CSV</button>}
      </div>
      <div className="overflow-x-auto rounded-lg bg-white p-4 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>User</th><th>Action</th><th>Module</th><th>Timestamp</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((activity) => (
              <tr key={activity.id} className="border-t">
                <td>{state.users.find((u) => u.id === activity.userId)?.name ?? activity.userId}</td>
                <td>{activity.action}</td><td>{activity.module}</td><td>{formatDate(activity.timestamp)}</td><td>{activity.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
