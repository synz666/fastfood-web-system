import { useLocation } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { formatDate, formatPrice } from '../utils/formatters';

export function OrdersPage() {
  const { orders } = useAppContext();
  const location = useLocation();
  const createdOrderNumber = location.state?.createdOrderNumber as string | undefined;

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Історія замовлень"
        title="Ваші попередні замовлення"
        description="Демо-історія зберігається локально у браузері користувача."
      />

      {createdOrderNumber ? <div className="success-banner">Замовлення {createdOrderNumber} успішно створено.</div> : null}

      {!orders.length ? (
        <EmptyState title="Історія порожня" description="Після першого оформлення замовлення тут зʼявиться список покупок." />
      ) : (
        <div className="stack-lg">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="inline-row wrap-between align-start">
                <div>
                  <h3>Замовлення {order.number}</h3>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
                <span className="status-pill">{order.status}</span>
              </div>
              <div className="stack-sm">
                {order.items.map((item) => (
                  <div key={item.id} className="summary-line">
                    <span>
                      {item.title} × {item.quantity}
                      {item.size ? ` · ${item.size.label}` : ''}
                      {item.addons.length ? ` · ${item.addons.map((addon) => addon.label).join(', ')}` : ''}
                    </span>
                    <strong>{formatPrice(item.itemPrice * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <hr />
              <div className="summary-line">
                <span>Клієнт</span>
                <strong>{order.customer.fullName}</strong>
              </div>
              <div className="summary-line">
                <span>Спосіб отримання</span>
                <strong>{order.customer.deliveryMethod}</strong>
              </div>
              <div className="summary-line">
                <span>Сума</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
