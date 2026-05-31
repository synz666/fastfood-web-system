import { Save } from 'lucide-react';
import { FormEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { SiteSettings } from '../../types';

export function SettingsPage() {
  const { siteSettings, setSiteSettings, pushToast } = useAppContext();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    pushToast('Налаштування збережено');
  };

  const update = (patch: Partial<SiteSettings>) => {
    setSiteSettings((current) => ({ ...current, ...patch }));
  };

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0 }}>Налаштування сайту</h2>

      <label>
        <span>Назва сайту</span>
        <input
          value={siteSettings.siteName}
          onChange={(e) => update({ siteName: e.target.value })}
        />
      </label>

      <label>
        <span>Короткий опис</span>
        <textarea
          rows={3}
          value={siteSettings.siteDescription}
          onChange={(e) => update({ siteDescription: e.target.value })}
        />
      </label>

      <div className="admin-form-grid">
        <label>
          <span>Телефон</span>
          <input value={siteSettings.phone} onChange={(e) => update({ phone: e.target.value })} />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={siteSettings.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </label>
      </div>

      <label>
        <span>Адреса</span>
        <input value={siteSettings.address} onChange={(e) => update({ address: e.target.value })} />
      </label>

      <label>
        <span>Графік роботи</span>
        <input
          value={siteSettings.workingHours}
          onChange={(e) => update({ workingHours: e.target.value })}
        />
      </label>

      <button type="submit" className="admin-btn admin-btn-primary">
        <Save size={16} /> Зберегти налаштування
      </button>
    </form>
  );
}
