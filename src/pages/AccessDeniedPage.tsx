import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { useAuth } from '../context/AuthContext';

export function AccessDeniedPage() {
  const { user } = useAuth();

  return (
    <div className="page-grid auth-page">
      <SectionTitle
        eyebrow="Доступ обмежено"
        title="Доступ заборонено"
        description="У вас немає необхідних прав для перегляду цього розділу. Цей розділ доступний лише адміністратору."
      />

      <div className="form-card auth-card access-denied-card">
        <div className="access-denied-icon">
          <ShieldAlert size={28} />
        </div>
        <p className="muted">
          {user
            ? `Ви увійшли як «${user.login}» з роллю «${user.role}». Для адміністрування потрібен обліковий запис адміністратора.`
            : 'Увійдіть під обліковим записом адміністратора, щоб отримати доступ.'}
        </p>
        <div className="inline-row compact wrap-mobile">
          <Link to="/" className="btn btn-secondary compact">
            На головну
          </Link>
          {!user ? (
            <Link to="/login" className="btn btn-primary compact" state={{ from: '/admin' }}>
              Увійти
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
