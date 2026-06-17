import type { DashboardStats } from '../types';

export function DashboardCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Active Projects', value: stats.activeProjects },
    { label: 'Pending Tasks', value: stats.pendingTasks },
    { label: 'Completion Rate', value: `${stats.completionRate}%` },
    { label: 'Team Utilization', value: `${stats.teamUtilization}%` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
