import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import type { CustomerInfo } from '../types';
import { formatPrice } from '../utils/formatters';

const initialForm: CustomerInfo = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  comment: '',
  paymentMethod: 'Готівка' as const,
  deliveryMethod: 'Доставка' as const,
};

export function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useAppContext();
  const [form, setForm] = useState<CustomerInfo>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Вкажіть, будь ласка, імʼя та прізвище.';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Вкажіть номер телефону для звʼязку.';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Вкажіть email для підтвердження замовлення.';
    }
    if (form.deliveryMethod === 'Доставка' && !form.address.trim()) {
      nextErrors.address = 'Вкажіть адресу доставки в Полтаві.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!cart.length) return;
    if (!validateForm()) return;

    const order = placeOrder(form);
    navigate('/orders', { state: { createdOrderNumber: order.number } });
  };

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Оформлення замовлення"
        title="Заповніть дані для доставки або самовивозу"
        description="Після підтвердження замовлення воно зʼявиться в історії замовлень."
      />

      <div className="checkout-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className={errors.fullName ? 'field-error-label' : ''}>
              <span>Імʼя та прізвище</span>
              <input
                required
                aria-invalid={Boolean(errors.fullName)}
                placeholder="Введіть ваше імʼя"
                value={form.fullName}
                onChange={(event) => {
                  setForm({ ...form, fullName: event.target.value });
                  setErrors((current) => ({ ...current, fullName: '' }));
                }}
              />
              {errors.fullName ? <span className="field-error">{errors.fullName}</span> : null}
            </label>
            <label className={errors.phone ? 'field-error-label' : ''}>
              <span>Номер телефону</span>
              <input
                required
                aria-invalid={Boolean(errors.phone)}
                placeholder="+380..."
                value={form.phone}
                onChange={(event) => {
                  setForm({ ...form, phone: event.target.value });
                  setErrors((current) => ({ ...current, phone: '' }));
                }}
              />
              {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
            </label>
          </div>

          <label className={errors.email ? 'field-error-label' : ''}>
            <span>Email</span>
            <input
              type="email"
              required
              aria-invalid={Boolean(errors.email)}
              placeholder="user@example.com"
              value={form.email ?? ''}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value });
                setErrors((current) => ({ ...current, email: '' }));
              }}
            />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </label>

          <div className="form-grid">
            <label>
              <span>Спосіб отримання</span>
              <select
                value={form.deliveryMethod}
                onChange={(event) =>
                  setForm({
                    ...form,
                    deliveryMethod: event.target.value as typeof form.deliveryMethod,
                  })
                }
              >
                <option>Доставка</option>
                <option>Самовивіз</option>
              </select>
            </label>
            <label>
              <span>Спосіб оплати</span>
              <select
                value={form.paymentMethod}
                onChange={(event) =>
                  setForm({
                    ...form,
                    paymentMethod: event.target.value as typeof form.paymentMethod,
                  })
                }
              >
                <option>Готівка</option>
                <option>Картка онлайн</option>
                <option>Картка при отриманні</option>
              </select>
            </label>
          </div>

          <label className={errors.address ? 'field-error-label' : ''}>
            <span>Адреса доставки</span>
            <input
              placeholder="м. Полтава, вулиця, будинок, квартира"
              value={form.address}
              onChange={(event) => {
                setForm({ ...form, address: event.target.value });
                setErrors((current) => ({ ...current, address: '' }));
              }}
              required={form.deliveryMethod === 'Доставка'}
              disabled={form.deliveryMethod === 'Самовивіз'}
              aria-invalid={Boolean(errors.address)}
            />
            {errors.address ? <span className="field-error">{errors.address}</span> : null}
          </label>

          <label>
            <span>Коментар до замовлення</span>
            <textarea
              rows={4}
              placeholder="Наприклад: без цибулі, зателефонувати перед доставкою"
              value={form.comment}
              onChange={(event) => setForm({ ...form, comment: event.target.value })}
            />
          </label>

          <button className="btn btn-primary btn-full" type="submit" disabled={!cart.length}>
            Підтвердити замовлення на {formatPrice(cartTotal)}
          </button>
        </form>

        <aside className="summary-card sticky-card">
          <h3>Ваше замовлення</h3>
          <div className="stack-sm">
            {cart.map((item) => (
              <div key={item.id} className="summary-line">
                <span>{item.title} × {item.quantity}</span>
                <strong>{formatPrice(item.itemPrice * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-line">
            <span>До сплати</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
