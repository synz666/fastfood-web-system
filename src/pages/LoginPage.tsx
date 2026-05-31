import { LogIn } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const { pushToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = await login(identifier, password);
      pushToast('Вхід виконано', `Вітаємо, ${session.login}!`);

      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTo === '/admin' ? '/' : redirectTo, { replace: true });
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Помилка входу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-grid auth-page">
      <SectionTitle
        eyebrow="Авторизація"
        title="Вхід до акаунту"
        description="Увійдіть за логіном або email, щоб зберігати історію замовлень і швидше оформлювати покупки."
      />

      <form className="form-card auth-card" onSubmit={handleSubmit}>
        {error ? <div className="auth-error">{error}</div> : null}

        <label>
          <span>Логін або email</span>
          <input
            required
            autoComplete="username"
            placeholder="логін або email"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
        </label>

        <label>
          <span>Пароль</span>
          <div className="password-row">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? 'Сховати' : 'Показати'}
            </button>
          </div>
        </label>

        <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
          <LogIn size={18} /> {isSubmitting ? 'Вхід...' : 'Увійти'}
        </button>

        <p className="auth-switch muted">
          Ще немає акаунту?{' '}
          <Link to="/register" className="auth-link">
            Зареєструватися
          </Link>
        </p>
      </form>
    </div>
  );
}
