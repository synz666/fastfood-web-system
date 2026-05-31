import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/admin': {
    title: 'Дашборд',
    description: 'Огляд магазину та останні замовлення',
  },
  '/admin/products/new': {
    title: 'Додати товар',
    description: 'Створення нової позиції меню',
  },
  '/admin/products': {
    title: 'Товари',
    description: 'Каталог товарів та керування позиціями',
  },
  '/admin/orders': {
    title: 'Замовлення',
    description: 'Перегляд і зміна статусів замовлень',
  },
  '/admin/categories': {
    title: 'Категорії',
    description: 'Категорії меню закладу',
  },
  '/admin/users': {
    title: 'Користувачі',
    description: 'Зареєстровані користувачі сайту',
  },
  '/admin/settings': {
    title: 'Налаштування',
    description: 'Контакти та основна інформація сайту',
  },
};

export function AdminHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const meta =
    pathname.includes('/edit')
      ? { title: 'Редагування товару', description: 'Оновлення позиції меню' }
      : PAGE_META[pathname] ?? PAGE_META['/admin'];

  return (
    <header className="admin-header">
      <h1>Вітаємо, {user?.login ?? 'admin'}</h1>
      <p>
        <strong>{meta.title}</strong>: {meta.description}
      </p>
    </header>
  );
}
