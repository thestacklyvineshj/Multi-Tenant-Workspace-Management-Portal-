import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../hooks/useAppContext';
import { ROLE_ACTIONS } from '../constants/rbac';
import type { Project } from '../types';

const schema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  ownerId: z.string().min(1, 'Owner is required'),
  status: z.enum(['planned', 'in_progress', 'completed', 'on_hold']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.string().min(1, 'Due date is required'),
});
type FormData = z.infer<typeof schema>;

export function ProjectsPage() {
  const { state, dispatch, session } = useAppContext();
  const role = session?.role ?? 'viewer';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'planned' | 'in_progress' | 'completed' | 'on_hold'>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'planned', priority: 'medium' },
  });

  const perms = ROLE_ACTIONS[role];
  const filtered = useMemo(
    () =>
      state.projects.filter((project) => {
        const matchSearch = project.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [search, state.projects, statusFilter],
  );

  const addProject = (values: FormData) => {
    if (!perms.canManageProjects || !session) return;
    const project: Project = { id: crypto.randomUUID(), ...values, assignedUserIds: [values.ownerId] };
    dispatch({ type: 'ADD_PROJECT', payload: project });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: crypto.randomUUID(),
        userId: session.userId,
        action: `Created project ${values.name}`,
        module: 'projects',
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
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Project Management</h3>
      </div>
      {perms.canManageProjects && (
        <form className="grid gap-3 rounded-lg bg-white p-4 dark:bg-slate-900 md:grid-cols-3" onSubmit={handleSubmit(addProject)}>
          <input className="rounded border px-3 py-2" placeholder="Project name" {...register('name')} />
          <select className="rounded border px-3 py-2" {...register('ownerId')}>
            <option value="">Select owner</option>
            {state.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <input type="date" className="rounded border px-3 py-2" {...register('dueDate')} />
          <select className="rounded border px-3 py-2" {...register('status')}>
            <option value="planned">Planned</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="on_hold">On Hold</option>
          </select>
          <select className="rounded border px-3 py-2" {...register('priority')}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
          <button className="rounded bg-indigo-600 px-3 py-2 text-white">Add Project</button>
          <p className="text-xs text-red-500 md:col-span-3">
            {errors.name?.message ?? errors.ownerId?.message ?? errors.dueDate?.message}
          </p>
        </form>
      )}
      <div className="grid gap-3 rounded-lg bg-white p-4 dark:bg-slate-900 md:grid-cols-2">
        <input className="rounded border px-3 py-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." />
        <select className="rounded border px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'planned' | 'in_progress' | 'completed' | 'on_hold')}>
          <option value="all">All Status</option><option value="planned">Planned</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="on_hold">On Hold</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white p-4 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>Name</th><th>Owner</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((project) => (
              <tr key={project.id} className="border-t">
                <td>{project.name}</td>
                <td>{state.users.find((user) => user.id === project.ownerId)?.name ?? 'Unknown'}</td>
                <td>{project.status}</td>
                <td>{project.priority}</td>
                <td>{project.dueDate}</td>
                <td>
                  {perms.canDeleteProjects && (
                    <button className="text-red-500" onClick={() => dispatch({ type: 'DELETE_PROJECT', payload: { projectId: project.id } })}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
