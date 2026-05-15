export type Category =
  | 'бургери'
  | 'піца'
  | 'снеки'
  | 'напої'
  | 'соуси'
  | 'десерти';

export type Theme = 'light' | 'dark';

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
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  status: 'Прийнято' | 'Готується' | 'Передано курʼєру' | 'Виконано';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
}
