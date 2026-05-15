import { CheckCircle2, Gauge, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';

const features = [
  {
    title: 'Клієнтський модуль',
    description: 'Перегляд меню, вибір модифікаторів, кошик, оформлення замовлення, історія покупок.',
    icon: ShoppingCart,
  },
  {
    title: 'Адміністрування меню',
    description: 'Додавання, редагування, зміна категорій, цін, описів, картинок та доступності товарів.',
    icon: LayoutDashboard,
  },
  {
    title: 'Сучасний інтерфейс',
    description: 'Адаптивна верстка, світла і темна тема, UX-орієнтована навігація та інформативні картки.',
    icon: Gauge,
  },
  {
    title: 'Локальне збереження',
    description: 'Меню, кошик та історія замовлень залишаються у браузері навіть після перезавантаження сторінки.',
    icon: CheckCircle2,
  },
];

export function AboutPage() {
  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Про систему"
        title="Що являє собою ШвидкоFood"
        description="Це веб-орієнтована інформаційна система для автоматизації діяльності закладу швидкого харчування."
      />

      <section className="info-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="info-card">
              <div className="info-icon"><Icon size={22} /></div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="content-card">
        <h3>Для чого створено проєкт</h3>
        <p>
          Застосунок демонструє, як цифрова система може допомогти закладу швидкого харчування автоматизувати
          роботу з меню, покращити досвід клієнтів та спростити адміністративне керування контентом.
        </p>
      </section>
    </div>
  );
}
