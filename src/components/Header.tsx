import { LogIn, LogOut, MoonStar, Shield, ShoppingBag, Store, SunMedium, UserRound } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const baseNavigation = [
  { to: '/', label: 'Головна' },
  { to: '/menu', label: 'Меню' },
  { to: '/orders', label: 'Історія замовлень' },
  { to: '/about', label: 'Про нас' },
  { to: '/contacts', label: 'Контакти' },
];

export function Header() {
  const { cartCount, theme, toggleTheme } = useAppContext();
  const { user, isAdmin, logout } = useAuth();

  const navigation = isAdmin
    ? [...baseNavigation, { to: '/admin', label: 'Адмін-панель' }]
    : baseNavigation;

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand-mark">
          <div className="brand-icon"><Store size={20} /></div>
          <div>
            <strong>ШвидкоFood</strong>
            <span>Доставка та самовивіз</span>
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

          {user ? (
            <div className="auth-user-block">
              <span className="auth-user-label" title={user.email}>
                {isAdmin ? <Shield size={16} /> : <UserRound size={16} />}
                <span>{user.login}</span>
              </span>
              <button type="button" className="btn btn-secondary compact" onClick={logout}>
                <LogOut size={16} /> Вийти
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary compact">
              <LogIn size={16} /> Увійти
            </Link>
          )}

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
