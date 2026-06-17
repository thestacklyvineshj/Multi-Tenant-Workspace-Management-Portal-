import { ROLE_LABELS } from '../constants/rbac';
import { useAppContext } from '../hooks/useAppContext';

export function Topbar() {
  const { dispatch, session, state } = useAppContext();

  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Control Panel</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {session ? ROLE_LABELS[session.role] : 'Guest'}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="rounded-md bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700 dark:text-slate-100"
        >
          {state.theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="rounded-md bg-red-500 px-3 py-2 text-sm text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
