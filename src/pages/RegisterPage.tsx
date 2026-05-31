import { UserPlus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const { pushToast } = useAppContext();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await register(loginValue, email, password);
      pushToast('Реєстрація успішна', `Акаунт ${session.login} створено.`);
      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Помилка реєстрації.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-grid auth-page">
      <SectionTitle
        eyebrow="Реєстрація"
        title="Створити акаунт"
        description="Створіть акаунт, щоб зберігати історію замовлень і швидше оформлювати наступні покупки."
      />

      <form className="form-card auth-card" onSubmit={handleSubmit}>
        {error ? <div className="auth-error">{error}</div> : null}

        <label>
          <span>Логін</span>
          <input
            required
            autoComplete="username"
            placeholder="Наприклад: ivan_petrenko"
            value={loginValue}
            onChange={(event) => setLoginValue(event.target.value)}
          />
        </label>

        <label>
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <div className="form-grid">
          <label>
            <span>Пароль</span>
            <div className="password-row">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Мінімум 4 символи"
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
          <label>
            <span>Підтвердіть пароль</span>
            <div className="password-row">
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Повторіть пароль"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? 'Сховати' : 'Показати'}
              </button>
            </div>
          </label>
        </div>

        <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
          <UserPlus size={18} /> {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
        </button>

        <p className="auth-switch muted">
          Вже маєте акаунт?{' '}
          <Link to="/login" className="auth-link">
            Увійти
          </Link>
        </p>
      </form>
    </div>
  );
}
