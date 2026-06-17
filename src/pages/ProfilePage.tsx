import { ROLE_LABELS } from '../constants/rbac';
import { useAppContext } from '../hooks/useAppContext';
import { formatDate } from '../utils/helpers';

export function ProfilePage() {
  const { session, state } = useAppContext();
  if (!session) return null;
  const user = state.users.find((u) => u.id === session.userId);
  if (!user) return null;

  return (
    <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
      <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">Profile</h3>
      <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-300">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {ROLE_LABELS[user.role]}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Last Active:</strong> {formatDate(user.lastActive)}</p>
      </div>
    </div>
  );
}
