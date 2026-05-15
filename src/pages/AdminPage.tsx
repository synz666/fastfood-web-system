import { Pencil, PlusCircle, RotateCcw, Save, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { seedProducts } from '../data/seedProducts';
import type { Category, Product } from '../types';
import { formatPrice } from '../utils/formatters';

const categories: Category[] = ['бургери', 'піца', 'снеки', 'напої', 'соуси', 'десерти'];

interface ProductFormState {
  id?: string;
  title: string;
  description: string;
  composition: string;
  category: Category;
  basePrice: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  rating: string;
  prepTime: string;
  sizesText: string;
  addonsText: string;
}

const emptyForm: ProductFormState = {
  title: '',
  description: '',
  composition: '',
  category: 'бургери',
  basePrice: '',
  image: '',
  isAvailable: true,
  isPopular: false,
  isNew: false,
  rating: '4.5',
  prepTime: '10',
  sizesText: '',
  addonsText: '',
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-яіїєґ0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function createSvgFallback(title: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
      <rect width="800" height="560" rx="36" fill="#fed7aa"/>
      <text x="400" y="250" text-anchor="middle" font-size="110">🍽️</text>
      <text x="400" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#1f2937">${title}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function serializeSizes(product: Product): string {
  return product.sizes?.map((size) => `${size.label}:${size.priceModifier}`).join(', ') ?? '';
}

function serializeAddons(product: Product): string {
  return product.addons?.map((addon) => `${addon.label}:${addon.price}`).join(', ') ?? '';
}

function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    composition: product.composition,
    category: product.category,
    basePrice: String(product.basePrice),
    image: product.image,
    isAvailable: product.isAvailable,
    isPopular: Boolean(product.isPopular),
    isNew: Boolean(product.isNew),
    rating: String(product.rating),
    prepTime: String(product.prepTime),
    sizesText: serializeSizes(product),
    addonsText: serializeAddons(product),
  };
}

function parseSizes(text: string) {
  return text
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [label, price] = entry.split(':').map((part) => part.trim());
      return {
        id: `${toSlug(label || `size-${index}`)}-${index}`,
        label: label || `Розмір ${index + 1}`,
        priceModifier: Number(price || 0),
      };
    });
}

function parseAddons(text: string) {
  return text
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [label, price] = entry.split(':').map((part) => part.trim());
      return {
        id: `${toSlug(label || `addon-${index}`)}-${index}`,
        label: label || `Додаток ${index + 1}`,
        price: Number(price || 0),
      };
    });
}

export function AdminPage() {
  const { products, setProducts, pushToast } = useAppContext();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: products.length,
      available: products.filter((product) => product.isAvailable).length,
      newItems: products.filter((product) => product.isNew).length,
    }),
    [products],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const product: Product = {
      id: editingId ?? `${toSlug(form.title)}-${Date.now()}`,
      title: form.title,
      description: form.description,
      composition: form.composition,
      category: form.category,
      basePrice: Number(form.basePrice),
      image: form.image.trim() || createSvgFallback(form.title),
      isAvailable: form.isAvailable,
      isPopular: form.isPopular,
      isNew: form.isNew,
      rating: Number(form.rating),
      prepTime: Number(form.prepTime),
      sizes: parseSizes(form.sizesText),
      addons: parseAddons(form.addonsText),
    };

    setProducts((current) => {
      if (editingId) {
        return current.map((item) => (item.id === editingId ? product : item));
      }
      return [product, ...current];
    });

    pushToast(editingId ? 'Товар оновлено' : 'Товар додано', form.title);
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
  };

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    pushToast('Товар видалено');
  };

  const resetDemoData = () => {
    setProducts(seedProducts);
    setEditingId(null);
    setForm(emptyForm);
    pushToast('Меню скинуто до тестових даних');
  };

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Адміністрування"
        title="Керування меню"
        description="Додавання нових позицій, редагування ціни, категорії, опису, зображення та наявності."
      />

      <section className="admin-stats">
        <div className="summary-card"><span>Усього позицій</span><strong>{stats.total}</strong></div>
        <div className="summary-card"><span>Доступні зараз</span><strong>{stats.available}</strong></div>
        <div className="summary-card"><span>Новинки</span><strong>{stats.newItems}</strong></div>
      </section>

      <div className="admin-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="inline-row wrap-between align-start">
            <div>
              <h3>{editingId ? 'Редагування товару' : 'Додати новий товар'}</h3>
              <p className="muted">Поля для розмірів і додатків формату: Назва:ціна, Назва:ціна</p>
            </div>
            <div className="inline-row compact wrap-mobile">
              <button type="button" className="btn btn-secondary compact" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                <PlusCircle size={16} /> Новий запис
              </button>
              <button type="button" className="btn btn-secondary compact" onClick={resetDemoData}>
                <RotateCcw size={16} /> Скинути демо-дані
              </button>
            </div>
          </div>

          <div className="form-grid">
            <label>
              <span>Назва товару</span>
              <input required placeholder="Наприклад: Мега бургер" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label>
              <span>Категорія</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>Ціна, ₴</span>
              <input required type="number" min="0" placeholder="0" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
            </label>
            <label>
              <span>Час приготування, хв</span>
              <input required type="number" min="1" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>Рейтинг</span>
              <input required type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </label>
            <label>
              <span>Посилання або Data URL зображення</span>
              <input placeholder="https://... або залишити порожнім" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </label>
          </div>

          <label>
            <span>Короткий опис</span>
            <textarea rows={3} placeholder="Опис страви для картки товару" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>

          <label>
            <span>Склад</span>
            <textarea rows={3} placeholder="Перелік інгредієнтів" value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })} />
          </label>

          <label>
            <span>Розміри</span>
            <input placeholder="Стандарт:0, Подвійний:55" value={form.sizesText} onChange={(e) => setForm({ ...form, sizesText: e.target.value })} />
          </label>

          <label>
            <span>Додатки</span>
            <input placeholder="Сир:25, Бекон:30" value={form.addonsText} onChange={(e) => setForm({ ...form, addonsText: e.target.value })} />
          </label>

          <div className="check-grid">
            <label className="switch-row">
              <input type="checkbox" checked={form.isAvailable} onChange={() => setForm({ ...form, isAvailable: !form.isAvailable })} />
              <span>Є в наявності</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" checked={form.isPopular} onChange={() => setForm({ ...form, isPopular: !form.isPopular })} />
              <span>Позначити як хіт</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" checked={form.isNew} onChange={() => setForm({ ...form, isNew: !form.isNew })} />
              <span>Позначити як новинку</span>
            </label>
          </div>

          <button className="btn btn-primary btn-full" type="submit">
            <Save size={18} /> {editingId ? 'Зберегти зміни' : 'Додати товар'}
          </button>
        </form>

        <section className="stack-lg">
          {products.map((product) => (
            <article key={product.id} className="admin-item-card">
              <img src={product.image} alt={product.title} className="admin-thumb" />
              <div className="admin-item-info">
                <div className="inline-row wrap-between align-start">
                  <div>
                    <h3>{product.title}</h3>
                    <p>{product.category}</p>
                  </div>
                  <strong>{formatPrice(product.basePrice)}</strong>
                </div>
                <p>{product.description}</p>
                <div className="modifier-list">
                  <span>{product.isAvailable ? 'У наявності' : 'Недоступно'}</span>
                  {product.isPopular ? <span>Хіт</span> : null}
                  {product.isNew ? <span>Новинка</span> : null}
                </div>
                <div className="inline-row compact wrap-mobile">
                  <button type="button" className="btn btn-secondary compact" onClick={() => startEditing(product)}>
                    <Pencil size={16} /> Редагувати
                  </button>
                  <button type="button" className="btn btn-secondary compact danger" onClick={() => deleteProduct(product.id)}>
                    <Trash2 size={16} /> Видалити
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
