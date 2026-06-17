import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardCards } from '../components/DashboardCards';
import { ROLE_LABELS } from '../constants/rbac';
import { useAppContext } from '../hooks/useAppContext';
import { formatDate } from '../utils/helpers';

export function DashboardPage() {
  const { state, session } = useAppContext();
  if (!session) return null;

  const stats = state.dashboardStats[session.role];
  const assignedProjects = state.projects.filter((project) =>
    project.assignedUserIds.includes(session.userId),
  );
  const recentActivities = state.activities.slice(0, 5);
  const chartData = [
    { name: 'Completion', value: stats.completionRate },
    { name: 'Utilization', value: stats.teamUtilization },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {ROLE_LABELS[session.role]} Dashboard
        </h3>
      </div>
      <DashboardCards stats={stats} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
          <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Performance Overview</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
          <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Assigned Projects</h4>
          <ul className="space-y-2 text-sm">
            {assignedProjects.map((project) => (
              <li key={project.id} className="rounded bg-slate-50 p-2 dark:bg-slate-800">
                {project.name} - {project.status}
              </li>
            ))}
            {assignedProjects.length === 0 && <li className="text-slate-500">No assigned projects</li>}
          </ul>
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
        <h4 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Recent Activities</h4>
        <ul className="space-y-2 text-sm">
          {recentActivities.map((item) => (
            <li key={item.id} className="flex justify-between rounded bg-slate-50 p-2 dark:bg-slate-800">
              <span>{item.action}</span>
              <span>{formatDate(item.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
