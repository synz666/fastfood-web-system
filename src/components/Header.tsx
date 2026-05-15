import { MoonStar, ShoppingBag, Store, SunMedium } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const navigation = [
  { to: '/', label: 'Головна' },
  { to: '/menu', label: 'Меню' },
  { to: '/cart', label: 'Кошик' },
  { to: '/orders', label: 'Історія замовлень' },
  { to: '/about', label: 'Про нас' },
  { to: '/contacts', label: 'Контакти' },
  { to: '/admin', label: 'Адмін-панель' },
];

export function Header() {
  const { cartCount, theme, toggleTheme } = useAppContext();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand-mark">
          <div className="brand-icon"><Store size={20} /></div>
          <div>
            <strong>ШвидкоFood</strong>
            <span>Fast food information system</span>
          </div>
        </Link>
        <nav className="main-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Змінити тему">
            {theme === 'light' ? <MoonStar size={18} /> : <SunMedium size={18} />}
          </button>
          <Link to="/cart" className="cart-button">
            <ShoppingBag size={18} />
            <span>Кошик</span>
            <b>{cartCount}</b>
          </Link>
        </div>
      </div>
    </header>
  );
}
