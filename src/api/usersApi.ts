import { apiFetch } from './apiClient';
import type { PublicUser, UserRole } from '../types';

export async function getUsers(): Promise<PublicUser[]> {
  return apiFetch<PublicUser[]>('/users');
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  await apiFetch<void>(`/users/${userId}/role`, {
    method: 'PATCH',
    body: { role },
  });
}

export async function deleteUser(userId: string): Promise<void> {
  await apiFetch<void>(`/users/${userId}`, {
    method: 'DELETE',
  });
}
