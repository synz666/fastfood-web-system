import { Eye, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Order, OrderStatus } from '../../types';
import { formatDateCompact, formatPrice } from '../../utils/formatters';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

const STATUSES: OrderStatus[] = ['Нове', 'В обробці', 'Готується', 'Виконано', 'Скасовано'];
const FILTERS: Array<OrderStatus | 'усі'> = ['усі', ...STATUSES];

export function OrdersAdminPage() {
  const { orders, updateOrderStatus, deleteOrder, pushToast } = useAppContext();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'усі'>('усі');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'усі') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const totalRevenue = useMemo(
    () =>
      filteredOrders
        .filter((order) => order.status !== 'Скасовано')
        .reduce((sum, order) => sum + order.total, 0),
    [filteredOrders],
  );

  return (
    <>
      <div className="admin-card">
        <div className="admin-toolbar">
          <div>
            <h2 style={{ margin: 0 }}>Замовлення</h2>
            <p style={{ margin: '6px 0 0', color: '#64748b' }}>
              Сума відфільтрованих: <strong>{formatPrice(totalRevenue)}</strong>
            </p>
          </div>
          <div className="admin-filter">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={statusFilter === filter ? 'active' : ''}
                onClick={() => setStatusFilter(filter)}
              >
                {filter === 'усі' ? 'Усі' : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Клієнт</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Сума</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.number}</td>
                    <td>{order.customer.fullName}</td>
                    <td>{order.customer.email || '-'}</td>
                    <td>{order.customer.phone}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>{formatDateCompact(order.createdAt)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={async () => {
                            await deleteOrder(order.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>Замовлень не знайдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder ? (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Замовлення #{selectedOrder.number}</h3>
            <p>
              <strong>Клієнт:</strong> {selectedOrder.customer.fullName}
            </p>
            <p>
              <strong>Телефон:</strong> {selectedOrder.customer.phone}
            </p>
            {selectedOrder.customer.email ? (
              <p>
                <strong>Email:</strong> {selectedOrder.customer.email}
              </p>
            ) : null}
            <p>
              <strong>Отримання:</strong> {selectedOrder.customer.deliveryMethod}
            </p>
            <p>
              <strong>Оплата:</strong> {selectedOrder.customer.paymentMethod}
            </p>
            <p>
              <strong>Адреса:</strong> {selectedOrder.customer.address || '-'}
            </p>
            {selectedOrder.customer.comment ? (
              <p>
                <strong>Коментар:</strong> {selectedOrder.customer.comment}
              </p>
            ) : null}
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
            <div className="stack-sm">
              {selectedOrder.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <strong>{formatPrice(item.itemPrice * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16 }}>
              <strong>Сума:</strong> {formatPrice(selectedOrder.total)}
            </p>
            <p>
              <OrderStatusBadge status={selectedOrder.status} />
            </p>
            <button type="button" className="admin-btn" onClick={() => setSelectedOrder(null)}>
              Закрити
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
