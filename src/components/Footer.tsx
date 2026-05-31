import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const footerLinks = [
  { to: '/menu', label: 'Меню' },
  { to: '/cart', label: 'Кошик' },
  { to: '/orders', label: 'Історія замовлень' },
  { to: '/about', label: 'Про нас' },
  { to: '/contacts', label: 'Контакти' },
];

export function Footer() {
  const { siteSettings } = useAppContext();

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div>
          <strong>{siteSettings.siteName}</strong>
          <p>{siteSettings.siteDescription}</p>
        </div>
        <div>
          <strong>Розділи сайту</strong>
          <nav className="footer-links">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <strong>Контакти</strong>
          <p>{siteSettings.address}</p>
          <p>{siteSettings.phone}</p>
          <p>{siteSettings.email}</p>
          <p>{siteSettings.workingHours}</p>
        </div>
      </div>
      <div className="footer-meta">
        <p>© 2026 Семенко Іван. Усі права захищено.</p>
        <p>Кваліфікаційна робота, ВСП «ППФК НТУ «ХПІ», 45 група.</p>
      </div>
    </footer>
  );
}
