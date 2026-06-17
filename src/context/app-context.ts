import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { AppAction, AppState, AuthSession, Role } from '../types';

export interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  currentRole: Role | null;
  session: AuthSession | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
