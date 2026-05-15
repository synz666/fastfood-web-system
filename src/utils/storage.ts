export const STORAGE_KEYS = {
  products: 'fastfood.products',
  cart: 'fastfood.cart',
  orders: 'fastfood.orders',
  theme: 'fastfood.theme',
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
