import type { OrderStatus } from '../../types';

const STATUS_CLASS: Record<OrderStatus, string> = {
  Нове: 'admin-status--new',
  'В обробці': 'admin-status--processing',
  Готується: 'admin-status--cooking',
  Виконано: 'admin-status--done',
  Скасовано: 'admin-status--cancelled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`admin-status ${STATUS_CLASS[status]}`}>{status}</span>;
}
