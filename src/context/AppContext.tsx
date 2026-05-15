import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  CartItem,
  CustomerInfo,
  Order,
  Product,
  ProductAddon,
  ProductSize,
  Theme,
  ToastMessage,
} from '../types';
import { seedProducts } from '../data/seedProducts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { calculateProductPrice, createOrderNumber } from '../utils/product';

interface ProductSelection {
  product: Product;
  size?: ProductSize;
  addons?: ProductAddon[];
}

interface AppContextValue {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  theme: Theme;
  toastMessages: ToastMessage[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addToCart: (selection: ProductSelection) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: (customer: CustomerInfo) => Order;
  cartCount: number;
  cartTotal: number;
  toggleTheme: () => void;
  pushToast: (title: string, description?: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>(STORAGE_KEYS.products, seedProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.cart, []);
  const [orders, setOrders] = useLocalStorage<Order[]>(STORAGE_KEYS.orders, []);
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.theme, 'light');
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const pushToast = (title: string, description?: string) => {
    const id = crypto.randomUUID();
    setToastMessages((current) => [...current, { id, title, description }]);
    window.setTimeout(() => {
      setToastMessages((current) => current.filter((item) => item.id !== id));
    }, 2800);
  };

  const dismissToast = (id: string) => {
    setToastMessages((current) => current.filter((item) => item.id !== id));
  };

  const addToCart = ({ product, size, addons = [] }: ProductSelection) => {
    const itemPrice = calculateProductPrice(product, size, addons);
    const existingKey = `${product.id}-${size?.id ?? 'default'}-${addons.map((addon) => addon.id).sort().join('_')}`;

    setCart((current) => {
      const existingItem = current.find((item) => item.id === existingKey);
      if (existingItem) {
        return current.map((item) =>
          item.id === existingKey ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          id: existingKey,
          productId: product.id,
          title: product.title,
          basePrice: product.basePrice,
          image: product.image,
          size,
          addons,
          quantity: 1,
          itemPrice,
        },
      ];
    });

    pushToast('Товар додано до кошика', `${product.title} успішно додано.`);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((current) => current.filter((item) => item.id !== itemId));
    pushToast('Позицію видалено', 'Товар прибрано з кошика.');
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customer: CustomerInfo) => {
    const order: Order = {
      id: crypto.randomUUID(),
      number: createOrderNumber(),
      createdAt: new Date().toISOString(),
      items: cart,
      customer,
      total: cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0),
      status: 'Прийнято',
    };

    setOrders((current) => [order, ...current]);
    clearCart();
    pushToast('Замовлення оформлено', `Номер вашого замовлення: ${order.number}`);
    return order;
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0), [cart]);

  const value = {
    products,
    cart,
    orders,
    theme,
    toastMessages,
    setProducts,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    cartCount,
    cartTotal,
    toggleTheme,
    pushToast,
    dismissToast,
  } satisfies AppContextValue;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
