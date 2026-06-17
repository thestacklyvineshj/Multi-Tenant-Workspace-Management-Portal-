import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
