import { seedSettings } from '../data/seedSettings';
import type { MenuCategory, Product, SiteSettings } from '../types';

export const CATEGORY_NAME_MAP: Record<string, string> = {
  бургери: 'Бургери',
  піца: 'Піца',
  снеки: 'Снеки',
  напої: 'Напої',
  соуси: 'Соуси',
  десерти: 'Десерти',
};

export function normalizeCategoryName(name: string): string {
  return CATEGORY_NAME_MAP[name] ?? name;
}

export function migrateProducts(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    category: normalizeCategoryName(product.category),
  }));
}

export function migrateCategories(categories: MenuCategory[]): MenuCategory[] {
  return categories.map((category) => ({
    ...category,
    name: normalizeCategoryName(category.name),
  }));
}

export function migrateSiteSettings(settings: SiteSettings): SiteSettings {
  const address = settings.address
    .replace(/м\.\s*Київ/gi, 'м. Полтава')
    .replace(/Київ/gi, 'Полтава')
    .replace(/Хрещатик/gi, 'Соборний майдан');

  const siteDescription = settings.siteDescription
    .replace(/у Києві/gi, 'у Полтаві')
    .replace(/в Києві/gi, 'в Полтаві')
    .replace(/Київ/gi, 'Полтава');

  const hasLegacyAddress = /київ|хрещатик/i.test(settings.address);

  return {
    ...settings,
    address: hasLegacyAddress ? seedSettings.address : address,
    siteDescription: /київ/i.test(settings.siteDescription)
      ? seedSettings.siteDescription
      : siteDescription,
  };
}
