import { useLocation } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { formatDate, formatPrice } from '../utils/formatters';

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function OrdersPage() {
  const { orders } = useAppContext();
  const location = useLocation();
  const createdOrderNumber = location.state?.createdOrderNumber as string | undefined;

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Історія замовлень"
        title="Ваші попередні замовлення"
        description="Переглядайте статус і склад попередніх замовлень у своєму акаунті."
      />

      {createdOrderNumber ? <div className="success-banner">Замовлення №{createdOrderNumber} успішно оформлено.</div> : null}

      {!orders.length ? (
        <EmptyState title="Історія замовлень порожня" description="Після оформлення замовлення воно зʼявиться тут." />
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
                {normalizeArray(order.items).map((item) => {
                  const addons = normalizeArray(item.addons);
                  return (
                    <div key={item.id} className="summary-line">
                      <span>
                        {item.title} × {item.quantity}
                        {item.size ? ` · ${item.size.label}` : ''}
                        {addons.length ? ` · ${addons.map((addon) => addon.label).join(', ')}` : ' · Без додатків'}
                      </span>
                      <strong>{formatPrice(item.itemPrice * item.quantity)}</strong>
                    </div>
                  );
                })}
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
