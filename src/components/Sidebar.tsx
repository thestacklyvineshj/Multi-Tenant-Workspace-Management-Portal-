import { NavLink } from 'react-router-dom';
import { SIDEBAR_BY_ROLE } from '../constants/navigation';
import { ROLE_LABELS } from '../constants/rbac';
import { useAppContext } from '../hooks/useAppContext';

export function Sidebar() {
  const { session } = useAppContext();
  if (!session) return null;

  const links = SIDEBAR_BY_ROLE[session.role];

  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:w-64">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Workspace Portal</h1>
      </div>
      <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        Role: {ROLE_LABELS[session.role]}
      </p>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
