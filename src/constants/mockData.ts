import type { Activity, DashboardStats, Project, Role, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Aarav Mehta', email: 'aarav@portal.com', role: 'super_admin', status: 'active', lastActive: new Date().toISOString() },
  { id: 'u2', name: 'Nisha Rao', email: 'nisha@portal.com', role: 'project_manager', status: 'active', lastActive: new Date(Date.now() - 3600000).toISOString() },
  { id: 'u3', name: 'Kabir Sharma', email: 'kabir@portal.com', role: 'team_lead', status: 'active', lastActive: new Date(Date.now() - 7200000).toISOString() },
  { id: 'u4', name: 'Riya Das', email: 'riya@portal.com', role: 'team_member', status: 'active', lastActive: new Date(Date.now() - 10800000).toISOString() },
  { id: 'u5', name: 'Vikram Patel', email: 'vikram@portal.com', role: 'viewer', status: 'inactive', lastActive: new Date(Date.now() - 86400000).toISOString() },
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Workspace Revamp', ownerId: 'u2', status: 'in_progress', priority: 'high', dueDate: '2026-07-10', assignedUserIds: ['u2', 'u3', 'u4'] },
  { id: 'p2', name: 'Analytics Integration', ownerId: 'u3', status: 'planned', priority: 'medium', dueDate: '2026-08-01', assignedUserIds: ['u3', 'u4'] },
  { id: 'p3', name: 'Security Audit', ownerId: 'u1', status: 'on_hold', priority: 'critical', dueDate: '2026-06-30', assignedUserIds: ['u1', 'u2'] },
];

export const mockActivities: Activity[] = [
  { id: 'a1', userId: 'u1', action: 'Logged in', module: 'auth', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success' },
  { id: 'a2', userId: 'u2', action: 'Created project Workspace Revamp', module: 'projects', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'success' },
  { id: 'a3', userId: 'u3', action: 'Updated project status', module: 'projects', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'warning' },
];

export const mockDashboardStats: Record<Role, DashboardStats> = {
  super_admin: { totalUsers: 45, activeProjects: 12, pendingTasks: 36, completionRate: 74, teamUtilization: 81 },
  project_manager: { totalUsers: 20, activeProjects: 9, pendingTasks: 22, completionRate: 69, teamUtilization: 77 },
  team_lead: { totalUsers: 12, activeProjects: 5, pendingTasks: 13, completionRate: 71, teamUtilization: 75 },
  team_member: { totalUsers: 6, activeProjects: 3, pendingTasks: 8, completionRate: 64, teamUtilization: 70 },
  viewer: { totalUsers: 6, activeProjects: 3, pendingTasks: 8, completionRate: 64, teamUtilization: 70 },
};
