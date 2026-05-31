import { apiFetch } from './apiClient';
import type { Product } from '../types';

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products');
}

export async function getProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function createProduct(product: Product): Promise<Product> {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: product,
  });
}

export async function updateProduct(id: string, product: Product): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: product,
  });
}

export async function deleteProductById(id: string): Promise<void> {
  return apiFetch<void>(`/products/${id}`, {
    method: 'DELETE',
  });
}
