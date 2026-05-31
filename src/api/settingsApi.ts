import { apiFetch } from './apiClient';
import type { SiteSettings } from '../types';

export async function getSettings(): Promise<SiteSettings> {
  return apiFetch<SiteSettings>('/settings');
}

export async function updateSettings(settings: SiteSettings): Promise<void> {
  await apiFetch<void>('/settings', {
    method: 'PUT',
    body: settings,
  });
}
