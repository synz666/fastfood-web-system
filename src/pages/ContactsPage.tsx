import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';

export function ContactsPage() {
  const { siteSettings } = useAppContext();

  const contacts = [
    { title: 'Адреса', value: siteSettings.address, icon: MapPin },
    { title: 'Телефон', value: siteSettings.phone, icon: Phone },
    { title: 'Email', value: siteSettings.email, icon: Mail },
    { title: 'Графік роботи', value: siteSettings.workingHours, icon: Clock3 },
  ];

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Контакти"
        title="Як нас знайти"
        description="Завітайте до закладу, зателефонуйте або напишіть. Ми завжди раді допомогти з замовленням."
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
          Маєте питання щодо меню, доставки чи співпраці? На звюзки: зателефонуйте
          {' '}
          {siteSettings.phone} або напишіть на {siteSettings.email}. Відповімо якнайшвидше.
        </p>
      </section>
    </div>
  );
}
