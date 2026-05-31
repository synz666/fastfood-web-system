import { apiFetch } from './apiClient';
import type { MenuCategory } from '../types';

export async function getCategories(): Promise<MenuCategory[]> {
  return apiFetch<MenuCategory[]>('/categories');
}

export async function createCategory(name: string): Promise<MenuCategory> {
  return apiFetch<MenuCategory>('/categories', {
    method: 'POST',
    body: { name },
  });
}

export async function updateCategory(id: string, name: string): Promise<MenuCategory> {
  return apiFetch<MenuCategory>(`/categories/${id}`, {
    method: 'PUT',
    body: { name },
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
