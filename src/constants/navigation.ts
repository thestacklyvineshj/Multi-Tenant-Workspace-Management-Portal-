import type { Role } from '../types';

export interface SidebarItem {
  label: string;
  path: string;
}

export const SIDEBAR_BY_ROLE: Record<Role, SidebarItem[]> = {
  super_admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'Projects', path: '/projects' },
    { label: 'Activity', path: '/activity' },
    { label: 'Profile', path: '/profile' },
  ],
  project_manager: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'Projects', path: '/projects' },
    { label: 'Activity', path: '/activity' },
    { label: 'Profile', path: '/profile' },
  ],
  team_lead: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Activity', path: '/activity' },
    { label: 'Profile', path: '/profile' },
  ],
  team_member: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Profile', path: '/profile' },
  ],
  viewer: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Activity', path: '/activity' },
    { label: 'Profile', path: '/profile' },
  ],
};
