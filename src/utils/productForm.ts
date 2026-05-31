import type { Product, ProductAddon, ProductSize } from '../types';

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-яіїєґ0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

export function createSvgFallback(title: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
      <rect width="800" height="560" rx="36" fill="#fed7aa"/>
      <text x="400" y="250" text-anchor="middle" font-size="110">🍽️</text>
      <text x="400" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#1f2937">${title}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function serializeSizes(product: Product): string {
  return product.sizes?.map((size) => `${size.label}:${size.priceModifier}`).join(', ') ?? '';
}

export function serializeAddons(product: Product): string {
  return product.addons?.map((addon) => `${addon.label}:${addon.price}`).join(', ') ?? '';
}

export function parseSizes(text: string): ProductSize[] {
  return text
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [label, price] = entry.split(':').map((part) => part.trim());
      return {
        id: `${toSlug(label || `size-${index}`)}-${index}`,
        label: label || `Розмір ${index + 1}`,
        priceModifier: Number(price || 0),
      };
    });
}

export function parseAddons(text: string): ProductAddon[] {
  return text
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [label, price] = entry.split(':').map((part) => part.trim());
      return {
        id: `${toSlug(label || `addon-${index}`)}-${index}`,
        label: label || `Додаток ${index + 1}`,
        price: Number(price || 0),
      };
    });
}

export interface ProductFormState {
  id?: string;
  title: string;
  description: string;
  composition: string;
  category: string;
  basePrice: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isPromo: boolean;
  prepTime: string;
  sizesText: string;
  addonsText: string;
}

export const emptyProductForm = (defaultCategory: string): ProductFormState => ({
  title: '',
  description: '',
  composition: '',
  category: defaultCategory,
  basePrice: '',
  image: '',
  isAvailable: true,
  isPopular: false,
  isNew: false,
  isPromo: false,
  prepTime: '10',
  sizesText: '',
  addonsText: '',
});

export function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    composition: product.composition,
    category: product.category,
    basePrice: String(product.basePrice),
    image: product.image,
    isAvailable: product.isAvailable,
    isPopular: Boolean(product.isPopular),
    isNew: Boolean(product.isNew),
    isPromo: Boolean(product.isPromo),
    prepTime: String(product.prepTime),
    sizesText: serializeSizes(product),
    addonsText: serializeAddons(product),
  };
}

export function formToProduct(form: ProductFormState, editingId?: string | null): Product {
  return {
    // For new products we return an empty id so the app will call POST /api/products.
    // When editing, preserve the existing id.
    id: editingId ?? '',
    title: form.title,
    description: form.description,
    composition: form.composition,
    category: form.category,
    basePrice: Number(form.basePrice),
    image: form.image.trim() || createSvgFallback(form.title),
    isAvailable: form.isAvailable,
    isPopular: form.isPopular,
    isNew: form.isNew,
    isPromo: form.isPromo,
    prepTime: Number(form.prepTime),
    sizes: parseSizes(form.sizesText),
    addons: parseAddons(form.addonsText),
  };
}
