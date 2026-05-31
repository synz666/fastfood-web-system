import type { AuthSession } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from './storage';

export function readSession(): AuthSession | null {
  return readStorage<AuthSession | null>(STORAGE_KEYS.session, null);
}

export function writeSession(session: AuthSession | null): void {
  writeStorage(STORAGE_KEYS.session, session);
}

export function toPublicSession(session: AuthSession): AuthSession {
  return {
    userId: session.userId,
    login: session.login,
    email: session.email,
    role: session.role,
    token: session.token,
  };
}

export function isAdminSession(session: AuthSession | null): boolean {
  return Boolean(session && session.role === 'admin');
}

export function validateSession(session: AuthSession | null): AuthSession | null {
  return session;
}
