import { Banknote, Hexagon, Package, ShoppingBag, Sparkles, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatDateCompact, formatPrice } from '../../utils/formatters';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export function DashboardPage() {
  const { products, orders } = useAppContext();

  const stats = useMemo(() => {
    const revenue = orders
      .filter((order) => order.status !== 'Скасовано')
      .reduce((sum, order) => sum + order.total, 0);
    const newOrders = orders.filter((order) => order.status === 'Нове').length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      revenue,
      newOrders,
      available: products.filter((product) => product.isAvailable).length,
      unavailable: products.filter((product) => !product.isAvailable).length,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 8);

  return (
    <>
      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <div>
            <span>Всього товарів</span>
            <strong>{stats.totalProducts}</strong>
          </div>
          <div className="admin-stat-icon"><Package size={20} /></div>
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Всього замовлень</span>
            <strong>{stats.totalOrders}</strong>
          </div>
          <div className="admin-stat-icon"><ShoppingBag size={20} /></div>
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Загальний дохід</span>
            <strong>{formatPrice(stats.revenue)}</strong>
          </div>
          <div className="admin-stat-icon"><Banknote size={20} /></div>
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Нові замовлення</span>
            <strong>{stats.newOrders}</strong>
          </div>
          <div className="admin-stat-icon"><Sparkles size={20} /></div>
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Доступні товари</span>
            <strong>{stats.available}</strong>
          </div>
          <div className="admin-stat-icon"><Hexagon size={20} /></div>
        </article>
        <article className="admin-stat-card">
          <div>
            <span>Немає в наявності</span>
            <strong>{stats.unavailable}</strong>
          </div>
          <div className="admin-stat-icon"><XCircle size={20} /></div>
        </article>
      </section>

      <section className="admin-grid-2">
        <article className="admin-card">
          <div className="admin-card-header">
            <h2>Останні замовлення</h2>
            <Link to="/admin/orders" className="admin-link">
              Усі замовлення →
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Клієнт</th>
                  <th>Контакт</th>
                  <th>Сума</th>
                  <th>Статус</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.number}</td>
                      <td>{order.customer.fullName}</td>
                      <td>{order.customer.email || order.customer.phone}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td>{formatDateCompact(order.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-empty-state">
                        <ShoppingBag size={28} />
                        <strong>Замовлень ще немає</strong>
                        <p>Нові замовлення з’являться тут після оформлення клієнтами.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-header">
            <h2>Швидкі дії</h2>
          </div>
          <div className="admin-quick-actions">
            <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
              <Package size={16} /> Додати товар
            </Link>
            <Link to="/admin/orders" className="admin-btn">
              <ShoppingBag size={16} /> Керувати замовленнями
            </Link>
            <Link to="/admin/products" className="admin-btn">
              <Hexagon size={16} /> Каталог товарів
            </Link>
            <Link to="/admin/settings" className="admin-btn">
              <Banknote size={16} /> Налаштування сайту
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
