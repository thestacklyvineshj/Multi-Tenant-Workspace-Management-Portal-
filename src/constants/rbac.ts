import type { Role } from '../types';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  project_manager: 'Project Manager',
  team_lead: 'Team Lead',
  team_member: 'Team Member',
  viewer: 'Viewer',
};

export const ROLE_ROUTE_ACCESS: Record<Role, string[]> = {
  super_admin: ['/dashboard', '/users', '/projects', '/activity', '/profile'],
  project_manager: ['/dashboard', '/users', '/projects', '/activity', '/profile'],
  team_lead: ['/dashboard', '/projects', '/activity', '/profile'],
  team_member: ['/dashboard', '/projects', '/profile'],
  viewer: ['/dashboard', '/activity', '/profile'],
};

export const ROLE_ACTIONS: Record<
  Role,
  {
    canManageUsers: boolean;
    canManageProjects: boolean;
    canDeleteProjects: boolean;
    canExportActivities: boolean;
  }
> = {
  super_admin: {
    canManageUsers: true,
    canManageProjects: true,
    canDeleteProjects: true,
    canExportActivities: true,
  },
  project_manager: {
    canManageUsers: true,
    canManageProjects: true,
    canDeleteProjects: true,
    canExportActivities: true,
  },
  team_lead: {
    canManageUsers: false,
    canManageProjects: true,
    canDeleteProjects: false,
    canExportActivities: true,
  },
  team_member: {
    canManageUsers: false,
    canManageProjects: false,
    canDeleteProjects: false,
    canExportActivities: false,
  },
  viewer: {
    canManageUsers: false,
    canManageProjects: false,
    canDeleteProjects: false,
    canExportActivities: false,
  },
};
