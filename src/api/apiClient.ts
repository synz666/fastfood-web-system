const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const STORAGE_TOKEN_KEY = 'fastfood.apiToken';

export function getAuthToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY) ?? undefined;
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }
}

interface ApiOptions extends RequestInit {
  body?: any;
}

async function parseError(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const json = await response.json();
    throw new Error(json.message || JSON.stringify(json));
  }
  const text = await response.text();
  throw new Error(text || response.statusText);
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    await parseError(response);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return (await response.json()) as T;
}
