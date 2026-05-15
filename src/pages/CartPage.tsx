import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';

export function CartPage() {
  const { cart, cartTotal, removeFromCart, updateCartQuantity } = useAppContext();

  if (!cart.length) {
    return (
      <div className="page-grid">
        <SectionTitle eyebrow="Кошик" title="Ваш кошик порожній" description="Додайте товари з меню, щоб перейти до оформлення замовлення." />
        <EmptyState title="Ще немає обраних позицій" description="Перейдіть до меню та оберіть страви, напої чи десерти." />
        <Link to="/menu" className="btn btn-primary">Перейти до меню</Link>
      </div>
    );
  }

  return (
    <div className="page-grid">
      <SectionTitle eyebrow="Кошик" title="Ваше замовлення" description="Перевірте кількість, модифікатори та суму перед оформленням." />

      <div className="cart-layout">
        <div className="stack-lg">
          {cart.map((item) => (
            <article key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-info">
                <div className="inline-row wrap-between">
                  <div>
                    <h3>{item.title}</h3>
                    <div className="modifier-list">
                      {item.size ? <span>Розмір: {item.size.label}</span> : null}
                      {item.addons.map((addon) => (
                        <span key={addon.id}>+ {addon.label}</span>
                      ))}
                    </div>
                  </div>
                  <strong>{formatPrice(item.itemPrice * item.quantity)}</strong>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-box">
                    <button type="button" className="icon-button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <strong>{item.quantity}</strong>
                    <button type="button" className="icon-button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <button type="button" className="btn btn-secondary compact" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} /> Видалити
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card sticky-card">
          <h3>Підсумок</h3>
          <div className="summary-line"><span>Кількість позицій</span><strong>{cart.length}</strong></div>
          <div className="summary-line"><span>Сума замовлення</span><strong>{formatPrice(cartTotal)}</strong></div>
          <div className="summary-line"><span>Доставка</span><strong>Безкоштовно від 500 ₴</strong></div>
          <Link to="/checkout" className="btn btn-primary btn-full">Оформити замовлення</Link>
          <Link to="/menu" className="btn btn-secondary btn-full">Додати ще товари</Link>
        </aside>
      </div>
    </div>
  );
}
