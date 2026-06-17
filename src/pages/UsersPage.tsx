import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../hooks/useAppContext';
import { usePagination } from '../hooks/usePagination';
import { ROLE_ACTIONS, ROLE_LABELS } from '../constants/rbac';
import type { Role, User } from '../types';
import { formatDate } from '../utils/helpers';

const schema = z.object({
  name: z.string().min(2, 'Name should be at least 2 characters'),
  email: z.string().email('Enter valid email'),
  role: z.enum(['super_admin', 'project_manager', 'team_lead', 'team_member', 'viewer']),
});

type FormData = z.infer<typeof schema>;

export function UsersPage() {
  const { state, dispatch, session } = useAppContext();
  const role = session?.role ?? 'viewer';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { role: 'team_member' } });

  const canManage = ROLE_ACTIONS[role].canManageUsers;

  const filtered = useMemo(
    () =>
      state.users.filter((user) => {
        const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, state.users, statusFilter],
  );

  const { page, setPage, paginated, totalPages } = usePagination(filtered);

  const addUser = (values: FormData) => {
    if (!canManage || !session) return;
    const user: User = {
      id: crypto.randomUUID(),
      name: values.name,
      email: values.email,
      role: values.role as Role,
      status: 'active',
      lastActive: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_USER', payload: user });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: crypto.randomUUID(),
        userId: session.userId,
        action: `Added user ${values.email}`,
        module: 'users',
        timestamp: new Date().toISOString(),
        status: 'success',
      },
    });
    reset();
  };

  if (!session) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">User Management</h3>
      </div>
      {canManage && (
        <form className="grid gap-3 rounded-lg bg-white p-4 dark:bg-slate-900 md:grid-cols-4" onSubmit={handleSubmit(addUser)}>
          <input placeholder="Name" className="rounded border px-3 py-2" {...register('name')} />
          <input placeholder="Email" className="rounded border px-3 py-2" {...register('email')} />
          <select className="rounded border px-3 py-2" {...register('role')}>
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button className="rounded bg-indigo-600 px-3 py-2 text-white">Add User</button>
          <p className="text-xs text-red-500 md:col-span-4">
            {errors.name?.message ?? errors.email?.message ?? errors.role?.message}
          </p>
        </form>
      )}
      <div className="grid gap-3 rounded-lg bg-white p-4 dark:bg-slate-900 md:grid-cols-3">
        <input className="rounded border px-3 py-2" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded border px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white p-4 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Active</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr key={user.id} className="border-t">
                <td>{user.name}</td><td>{user.email}</td><td>{ROLE_LABELS[user.role]}</td><td>{user.status}</td><td>{formatDate(user.lastActive)}</td>
                <td>
                  {canManage && user.status === 'active' && (
                    <button className="text-red-500" onClick={() => dispatch({ type: 'DEACTIVATE_USER', payload: { userId: user.id } })}>Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded bg-slate-200 px-2 py-1" onClick={() => setPage(Math.max(1, page - 1))}>Prev</button>
          <span className="text-xs">Page {page} / {totalPages}</span>
          <button className="rounded bg-slate-200 px-2 py-1" onClick={() => setPage(Math.min(totalPages, page + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}
