import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Sparkles, TimerReset } from 'lucide-react';
import { StatCard } from './StatCard';

export function Hero() {
  return (
    <section className="hero-card">
      <div>
        <span className="eyebrow">Заклад швидкого харчування у Полтаві</span>
        <h1>Смачна їжа з доставкою та самовивозом</h1>
        <p>
          Оберіть улюблені страви з меню, налаштуйте розмір і додатки, оформіть замовлення онлайн
          та відстежуйте його в історії: швидко й зручно.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/menu">
            Перейти до меню <ArrowRight size={18} />
          </Link>
          <Link className="btn btn-secondary" to="/cart">
            Перейти до кошика
          </Link>
        </div>
        <div className="hero-highlights">
          <div><Sparkles size={18} /> Новинки та хіти продажів</div>
          <div><TimerReset size={18} /> Швидке оформлення замовлення</div>
          <div><Clock3 size={18} /> Зручна історія замовлень</div>
        </div>
      </div>
      <div className="hero-visual">
        <img src="/images/hero-food-delivery.svg" alt="Доставка їжи від ШвидкоFood" className="hero-image" />
        <div className="stats-grid">
          <StatCard value="25+" label="позицій у меню" />
          <StatCard value="6" label="категорій страв" />
          <StatCard value="30" unit="хв" label="середній час доставки" />
          <StatCard value="4.8" label="середня оцінка гостей" />
        </div>
      </div>
    </section>
  );
}
