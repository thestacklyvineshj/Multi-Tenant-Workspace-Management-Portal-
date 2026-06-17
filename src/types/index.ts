export type Role =
  | 'super_admin'
  | 'project_manager'
  | 'team_lead'
  | 'team_member'
  | 'viewer';

export type UserStatus = 'active' | 'inactive';
export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'on_hold';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export type ActivityStatus = 'success' | 'warning' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
  assignedUserIds: string[];
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  module: 'auth' | 'dashboard' | 'users' | 'projects' | 'activity';
  timestamp: string;
  status: ActivityStatus;
}

export interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  pendingTasks: number;
  completionRate: number;
  teamUtilization: number;
}

export interface AuthSession {
  userId: string;
  role: Role;
  token: string;
}

export interface AppState {
  users: User[];
  projects: Project[];
  activities: Activity[];
  dashboardStats: Record<Role, DashboardStats>;
  session: AuthSession | null;
  theme: 'light' | 'dark';
}

export type AppAction =
  | { type: 'LOGIN'; payload: AuthSession }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'EDIT_USER'; payload: User }
  | { type: 'DEACTIVATE_USER'; payload: { userId: string } }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'EDIT_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: { projectId: string } }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'TOGGLE_THEME' };
