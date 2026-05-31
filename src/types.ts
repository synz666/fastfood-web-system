export type Category = string;

export type Theme = 'light' | 'dark';

export type OrderStatus = 'Нове' | 'В обробці' | 'Готується' | 'Виконано' | 'Скасовано';

export interface MenuCategory {
  id: string;
  name: string;
}

export interface ProductSize {
  id: string;
  label: string;
  priceModifier: number;
}

export interface ProductAddon {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  composition: string;
  category: Category;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  rating: number;
  prepTime: number;
  sizes?: ProductSize[];
  addons?: ProductAddon[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  basePrice: number;
  image: string;
  size?: ProductSize;
  addons: ProductAddon[];
  quantity: number;
  itemPrice: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  comment: string;
  paymentMethod: 'Готівка' | 'Картка онлайн' | 'Картка при отриманні';
  deliveryMethod: 'Доставка' | 'Самовивіз';
  email?: string;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  status: OrderStatus;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
}

export type UserRole = 'user' | 'admin';

export interface StoredUser {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  login: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface PublicUser {
  id: string;
  login: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
