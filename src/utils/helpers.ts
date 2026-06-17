import type { Activity, AppState } from '../types';

export const storageKey = 'workspace-portal-state';

export function loadState(): AppState | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function exportActivitiesCsv(activities: Activity[]): void {
  const header = 'User,Action,Module,Timestamp,Status';
  const rows = activities.map(
    (item) =>
      `"${item.userId}","${item.action}","${item.module}","${item.timestamp}","${item.status}"`,
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'activities.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
