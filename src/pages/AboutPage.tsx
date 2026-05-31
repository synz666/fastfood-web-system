import { CheckCircle2, Clock3, ShoppingCart, Truck } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';

const features = [
  {
    title: 'Широке меню',
    description: 'Бургери, піца, снеки, напої та десерти. Оберіть те, що хочеться саме зараз.',
    icon: ShoppingCart,
  },
  {
    title: 'Доставка та самовивіз',
    description: 'Замовляйте з доставкою по Полтаві або забирайте готове замовлення самовивозом у закладі.',
    icon: Truck,
  },
  {
    title: 'Швидке приготування',
    description: 'Готуємо швидко: середній час виконання замовлення близько 30 хвилин.',
    icon: Clock3,
  },
  {
    title: 'Зручний сервіс',
    description: 'Онлайн-меню, кошик, оформлення та історія замовлень у одному місці.',
    icon: CheckCircle2,
  },
];

export function AboutPage() {
  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Про нас"
        title="ШвидкоFood: ваш улюблений фастфуд поруч"
        description="Ми готуємо смачну їжу щодня: свіжі інгредієнти, зручне замовлення онлайн і турбота про кожного гостя."
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
        <h3>Наша історія</h3>
        <p>
          ШвидкоFood: сучасний заклад швидкого харчування в Полтаві. Поєднуємо улюблені смаки,
          швидкий сервіс і зручне онлайн-замовлення. Ми готуємо смачну їжу для тих, хто цінує час:
          дома, в офісі чи на винос.
        </p>
      </section>

      <section className="content-card">
        <h3>Про програму</h3>
        <p>
          Веб-орієнтована інформаційна система «ШвидкоFood» розроблена Семенком Іваном у межах кваліфікаційної роботи на підтвердження ступеня фахового молодшого бакалавра.
        </p>
        <p>Навчальний заклад: ВСП «ППФК НТУ «ХПІ».</p>
        <p>Група: 45.</p>
        <p>Керівник роботи: Ковальова Наталія Володимирівна.</p>
      </section>
    </div>
  );
}
