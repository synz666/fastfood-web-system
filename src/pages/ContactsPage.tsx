import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';

const contacts = [
  { title: 'Адреса', value: 'м. Київ, вул. Демонстраційна, 10', icon: MapPin },
  { title: 'Телефон', value: '+380 (99) 123-45-67', icon: Phone },
  { title: 'Email', value: 'info@shvydkofood.local', icon: Mail },
  { title: 'Графік роботи', value: 'Щодня з 09:00 до 22:00', icon: Clock3 },
];

export function ContactsPage() {
  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Контакти"
        title="Як нас знайти"
        description="Демонстраційна контактна інформація для сторінки закладу."
      />

      <section className="info-grid">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <article key={contact.title} className="info-card">
              <div className="info-icon"><Icon size={22} /></div>
              <h3>{contact.title}</h3>
              <p>{contact.value}</p>
            </article>
          );
        })}
      </section>

      <section className="content-card">
        <h3>Зворотний звʼязок</h3>
        <p>
          У реальному середовищі тут може бути форма для відправлення звернень, карта закладу, інтеграція з
          месенджерами або CRM. У демо-версії сторінка оформлена як частина повноцінного застосунку.
        </p>
      </section>
    </div>
  );
}
