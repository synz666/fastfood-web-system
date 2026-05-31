import { Save } from 'lucide-react';
import { FormEvent } from 'react';
import type { ProductFormState } from '../../utils/productForm';

interface Props {
  form: ProductFormState;
  categories: { id: string; name: string }[];
  isEditing: boolean;
  onChange: (form: ProductFormState) => void;
  onSubmit: (event: FormEvent) => void;
}

export function ProductFormAdmin({ form, categories, isEditing, onChange, onSubmit }: Props) {
  return (
    <form className="admin-form admin-card" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        <label>
          <span>Назва товару</span>
          <input
            required
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="Наприклад: Мега бургер"
          />
        </label>
        <label>
          <span>Категорія</span>
          <select
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-form-grid">
        <label>
          <span>Ціна, ₴</span>
          <input
            required
            type="number"
            min="0"
            value={form.basePrice}
            onChange={(e) => onChange({ ...form, basePrice: e.target.value })}
          />
        </label>
        <label>
          <span>Час приготування, хв</span>
          <input
            required
            type="number"
            min="1"
            value={form.prepTime}
            onChange={(e) => onChange({ ...form, prepTime: e.target.value })}
          />
        </label>
      </div>

      <div className="admin-form-grid">
        <label>
          <span>URL зображення</span>
          <input
            value={form.image}
            onChange={(e) => onChange({ ...form, image: e.target.value })}
            placeholder="https://... або залишити порожнім"
          />
        </label>
      </div>

      <label>
        <span>Короткий опис</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
        />
      </label>

      <label>
        <span>Повний склад / опис</span>
        <textarea
          rows={3}
          value={form.composition}
          onChange={(e) => onChange({ ...form, composition: e.target.value })}
        />
      </label>

      <label>
        <span>Розміри (Назва:ціна, ...)</span>
        <input
          value={form.sizesText}
          onChange={(e) => onChange({ ...form, sizesText: e.target.value })}
          placeholder="Стандарт:0, Подвійний:55"
        />
      </label>

      <label>
        <span>Додатки (Назва:ціна, ...)</span>
        <input
          value={form.addonsText}
          onChange={(e) => onChange({ ...form, addonsText: e.target.value })}
          placeholder="Сир:25, Бекон:30"
        />
      </label>

      <div className="admin-checks">
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={() => onChange({ ...form, isAvailable: !form.isAvailable })}
          />
          У наявності
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.isPopular}
            onChange={() => onChange({ ...form, isPopular: !form.isPopular })}
          />
          Хіт
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={() => onChange({ ...form, isNew: !form.isNew })}
          />
          Новинка
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.isPromo}
            onChange={() => onChange({ ...form, isPromo: !form.isPromo })}
          />
          Акція
        </label>
      </div>

      <button type="submit" className="admin-btn admin-btn-primary">
        <Save size={16} /> {isEditing ? 'Зберегти зміни' : 'Зберегти товар'}
      </button>
    </form>
  );
}
