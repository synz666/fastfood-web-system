import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  emptyProductForm,
  formToProduct,
  productToForm,
} from '../../utils/productForm';
import { ProductFormAdmin } from '../components/ProductFormAdmin';

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, upsertProduct, pushToast } = useAppContext();

  const categoryIds = useMemo(() => categories.map((category) => category.id), [categories]);
  const editingProduct = id ? products.find((product) => product.id === id) : undefined;
  const isEditing = Boolean(editingProduct);

  const [form, setForm] = useState(() =>
    editingProduct
      ? productToForm(editingProduct)
      : emptyProductForm(categoryIds[0] ?? ''),
  );

  useEffect(() => {
    if (editingProduct) {
      const initial = productToForm(editingProduct);
      // map category name (from GET /api/products) to category id from categories list
      const matched = categories.find((c) => c.name === editingProduct.category);
      setForm({ ...initial, category: matched ? matched.id : categoryIds[0] ?? '' });
    }
  }, [editingProduct, categories, categoryIds]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const product = formToProduct(form, editingProduct?.id ?? null);
    upsertProduct(product);
    pushToast(isEditing ? 'Товар оновлено' : 'Товар додано', product.title);
    navigate('/admin/products');
  };

  return (
    <ProductFormAdmin
      form={form}
      categories={categories}
      isEditing={isEditing}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
}
