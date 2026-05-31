import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedSettings } from '../data/seedSettings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type {
  CartItem,
  CustomerInfo,
  MenuCategory,
  Order,
  OrderStatus,
  Product,
  ProductAddon,
  ProductSize,
  SiteSettings,
  Theme,
  ToastMessage,
} from '../types';
import { STORAGE_KEYS } from '../utils/storage';
import { calculateProductPrice } from '../utils/product';
import { useAuth } from './AuthContext';
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  getCategories,
  updateCategory as updateCategoryApi,
} from '../api/categoriesApi';
import {
  createOrder as createOrderApi,
  deleteOrder as deleteOrderApi,
  getOrders,
  updateOrderStatus as updateOrderStatusApi,
} from '../api/ordersApi';
import {
  createProduct as createProductApi,
  deleteProductById,
  getProducts,
  updateProduct as updateProductApi,
} from '../api/productsApi';
import { getSettings, updateSettings as updateSettingsApi } from '../api/settingsApi';

interface ProductSelection {
  product: Product;
  size?: ProductSize;
  addons?: ProductAddon[];
}

interface AppContextValue {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  categories: MenuCategory[];
  siteSettings: SiteSettings;
  theme: Theme;
  toastMessages: ToastMessage[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  resetProductsToSeed: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  renameCategory: (categoryId: string, name: string) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  addToCart: (selection: ProductSelection) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: (customer: CustomerInfo) => Promise<Order>;
  cartCount: number;
  cartTotal: number;
  toggleTheme: () => void;
  pushToast: (title: string, description?: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.cart, []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(seedSettings);
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.theme, 'light');
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse, settingsResponse] = await Promise.all([
          getProducts(),
          getCategories(),
          getSettings(),
        ]);

        setProducts(productsResponse);
        setCategories(categoriesResponse);
        setSiteSettings(settingsResponse);
      } catch (error) {
        console.error('App initialization failed', error);
      }
    };

    void loadData();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }
      try {
        const ordersResponse = await getOrders();
        setOrders(ordersResponse);
      } catch (error) {
        console.error('Unable to load orders', error);
      }
    };

    void loadOrders();
  }, [user]);

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

  const upsertProduct = async (product: Product) => {
    try {
      const saved = product.id
        ? await updateProductApi(product.id, product)
        : await createProductApi(product);
      setProducts((current) => {
        const exists = current.some((item) => item.id === saved.id);
        if (exists) {
          return current.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...current];
      });
      pushToast('Товар збережено', saved.title);
    } catch (error) {
      pushToast('Не вдалося зберегти товар', String(error));
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteProductById(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      pushToast('Товар видалено');
    } catch (error) {
      pushToast('Не вдалося видалити товар', String(error));
      throw error;
    }
  };

  const resetProductsToSeed = async () => {
    try {
      const productsResponse = await getProducts();
      setProducts(productsResponse);
      pushToast('Дані синхронізовано', 'Продукти були оновлені з серверу.');
    } catch (error) {
      pushToast('Не вдалося оновити дані', String(error));
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusApi(orderId, status);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
      pushToast('Статус замовлення оновлено');
    } catch (error) {
      pushToast('Не вдалося оновити статус', String(error));
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteOrderApi(orderId);
      setOrders((current) => current.filter((order) => order.id !== orderId));
      pushToast('Замовлення видалено');
    } catch (error) {
      pushToast('Не вдалося видалити замовлення', String(error));
      throw error;
    }
  };

  const addCategory = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some((category) => category.name.toLowerCase() === trimmed.toLowerCase())) {
      pushToast('Категорія вже існує');
      return;
    }

    try {
      const created = await createCategoryApi(trimmed);
      setCategories((current) => [...current, created]);
      pushToast('Категорію додано', trimmed);
    } catch (error) {
      pushToast('Не вдалося створити категорію', String(error));
      throw error;
    }
  };

  const renameCategory = async (categoryId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const updated = await updateCategoryApi(categoryId, trimmed);
      const original = categories.find((category) => category.id === categoryId);
      setCategories((current) =>
        current.map((category) => (category.id === categoryId ? updated : category)),
      );
      if (original) {
        setProducts((current) =>
          current.map((product) =>
            product.category === original.name ? { ...product, category: trimmed } : product,
          ),
        );
      }
      pushToast('Категорію перейменовано');
    } catch (error) {
      pushToast('Не вдалося оновити категорію', String(error));
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryApi(categoryId);
      setCategories((current) => current.filter((category) => category.id !== categoryId));
      pushToast('Категорію видалено');
      return true;
    } catch (error) {
      pushToast('Неможливо видалити категорію', String(error));
      return false;
    }
  };

  const addToCart = ({ product, size, addons = [] }: ProductSelection) => {
    const itemPrice = calculateProductPrice(product, size, addons);
    const existingKey = `${product.id}-${size?.id ?? 'default'}-${addons
      .map((addon) => addon.id)
      .sort()
      .join('_')}`;

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

  const placeOrder = async (customer: CustomerInfo) => {
    const order = await createOrderApi(
      customer,
      cart,
      cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0),
    );
    setOrders((current) => [order, ...current]);
    clearCart();
    pushToast('Замовлення оформлено', `Номер вашого замовлення: ${order.number}`);
    return order;
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0),
    [cart],
  );

  const value = {
    products,
    cart,
    orders,
    categories,
    siteSettings,
    theme,
    toastMessages,
    setProducts,
    setOrders,
    setSiteSettings,
    upsertProduct,
    deleteProduct,
    resetProductsToSeed,
    updateOrderStatus,
    deleteOrder,
    addCategory,
    renameCategory,
    deleteCategory,
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
