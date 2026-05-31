import { apiFetch, setAuthToken } from './apiClient';
import type { AuthSession } from '../types';

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse extends AuthSession {
  token: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
  setAuthToken(result.token);
  return result;
}

export async function registerApi(payload: { login: string; email: string; password: string }): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
  setAuthToken(result.token);
  return result;
}

export async function fetchMe(): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/auth/me', {
    method: 'GET',
  });
  setAuthToken(result.token);
  return result;
}

export function logoutApi() {
  setAuthToken(null);
}
