import { apiFetch } from './apiClient';
import type { Order, CustomerInfo } from '../types';

export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders');
}

export async function getOrderById(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export async function createOrder(customer: CustomerInfo, items: unknown[], total: number): Promise<Order> {
  return apiFetch<Order>('/orders', {
    method: 'POST',
    body: {
      customer,
      items,
      total,
    },
  });
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  return apiFetch<void>(`/orders/${id}/status`, {
    method: 'PUT',
    body: { status },
  });
}

export async function deleteOrder(id: string): Promise<void> {
  return apiFetch<void>(`/orders/${id}`, {
    method: 'DELETE',
  });
}
