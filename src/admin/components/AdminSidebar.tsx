import {
  ExternalLink,
  Hexagon,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  ShoppingBag,
  Tags,
  Users,
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, end: true },
  { to: '/admin/products/new', label: 'Додати товар', icon: PlusCircle },
  { to: '/admin/products', label: 'Товари', icon: Package, end: true },
  { to: '/admin/orders', label: 'Замовлення', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Категорії', icon: Tags },
  { to: '/admin/users', label: 'Користувачі', icon: Users },
  { to: '/admin/settings', label: 'Налаштування', icon: Settings },
];

export function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">
          <Hexagon size={20} />
        </div>
        <div>
          <strong>ШвидкоFood</strong>
          <span>Адмін-панель</span>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-nav-footer">
        <Link to="/">
          <ExternalLink size={18} />
          На сайт
        </Link>
        <button type="button" onClick={logout}>
          <LogOut size={18} />
          Вийти
        </button>
      </div>
    </aside>
  );
}
