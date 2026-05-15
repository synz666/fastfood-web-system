import type { Product, ProductAddon, ProductSize } from '../types';

export function calculateProductPrice(
  product: Product,
  size?: ProductSize,
  addons: ProductAddon[] = [],
): number {
  return product.basePrice + (size?.priceModifier ?? 0) + addons.reduce((sum, addon) => sum + addon.price, 0);
}

export function createOrderNumber(): string {
  const part = Math.floor(Math.random() * 9000 + 1000);
  return `SF-${part}`;
}

export function productMatchesQuery(product: Product, query: string): boolean {
  const value = query.trim().toLowerCase();
  if (!value) return true;

  return [product.title, product.description, product.composition, product.category]
    .join(' ')
    .toLowerCase()
    .includes(value);
}
