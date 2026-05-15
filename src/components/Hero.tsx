import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { StatCard } from './StatCard';

export function Hero() {
  return (
    <section className="hero-card">
      <div>
        <span className="eyebrow">Інформаційна система закладу швидкого харчування</span>
        <h1>ШвидкоFood — сучасний сервіс для замовлення та керування меню</h1>
        <p>
          Повноцінний вебзастосунок із каталогом страв, модифікаторами, кошиком, оформленням замовлення,
          історією покупок та локальною адмін-панеллю.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/menu">
            Перейти до меню <ArrowRight size={18} />
          </Link>
          <Link className="btn btn-secondary" to="/admin">
            Відкрити адмін-панель
          </Link>
        </div>
        <div className="hero-highlights">
          <div><Sparkles size={18} /> Новинки та хіти продажів</div>
          <div><TimerReset size={18} /> Швидке оформлення замовлення</div>
          <div><ShieldCheck size={18} /> Дані зберігаються локально</div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-bubble">🍔</div>
        <div className="hero-bubble alt">🍟</div>
        <div className="hero-bubble small">🥤</div>
        <div className="stats-grid">
          <StatCard value="25+" label="Позицій у меню" />
          <StatCard value="6" label="Категорій товарів" />
          <StatCard value="24/7" label="Демо-доступ до системи" />
          <StatCard value="100%" label="Український інтерфейс" />
        </div>
      </div>
    </section>
  );
}
