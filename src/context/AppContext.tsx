import { useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppAction, AppState } from '../types';
import { mockActivities, mockDashboardStats, mockProjects, mockUsers } from '../constants/mockData';
import { loadState, saveState } from '../utils/helpers';
import { AppContext } from './app-context';

const initialState: AppState = {
  users: mockUsers,
  projects: mockProjects,
  activities: mockActivities,
  dashboardStats: mockDashboardStats,
  session: null,
  theme: 'light',
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, session: action.payload };
    case 'LOGOUT':
      return { ...state, session: null };
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
    case 'EDIT_USER':
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
      };
    case 'DEACTIVATE_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.userId ? { ...user, status: 'inactive' } : user,
        ),
      };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'EDIT_PROJECT':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project,
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload.projectId),
      };
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities] };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadState();
  const [state, dispatch] = useReducer(reducer, persisted ?? initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      currentRole: state.session?.role ?? null,
      session: state.session,
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
