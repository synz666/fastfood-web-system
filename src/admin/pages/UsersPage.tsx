import { ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { deleteUser, getUsers, updateUserRole } from '../../api/usersApi';
import { formatDateCompact } from '../../utils/formatters';
import type { PublicUser } from '../../types';

export function UsersPage() {
  const { pushToast } = useAppContext();
  const { user } = useAuth();
  const isRootAdmin = user?.login === 'admin';
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingUser, setPendingUser] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await getUsers();
      setUsers(usersResponse);
    } catch (error) {
      pushToast('Не вдалося завантажити користувачів', String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleToggleRole = async (targetUser: PublicUser) => {
    if (!isRootAdmin) {
      pushToast('Тільки головний адміністратор може керувати ролями');
      return;
    }

    if (targetUser.login === 'admin') {
      pushToast('Неможливо змінити роль головного адміністратора');
      return;
    }

    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setPendingUser(targetUser.id);

    try {
      await updateUserRole(targetUser.id, nextRole);
      setUsers((current) =>
        current.map((item) => (item.id === targetUser.id ? { ...item, role: nextRole } : item)),
      );
      pushToast(
        nextRole === 'admin' ? 'Права адміністратора надано' : 'Права адміністратора вилучено',
        targetUser.login,
      );
    } catch (error) {
      pushToast('Не вдалося змінити роль користувача', String(error));
    } finally {
      setPendingUser(null);
    }
  };

  const handleDeleteUser = async (targetUser: PublicUser) => {
    if (!isRootAdmin) {
      pushToast('Тільки головний адміністратор може видаляти користувачів');
      return;
    }

    if (targetUser.login === 'admin') {
      pushToast('Неможливо видалити головного адміністратора');
      return;
    }

    const confirmed = window.confirm(`Ви дійсно хочете видалити користувача ${targetUser.login}?`);
    if (!confirmed) {
      return;
    }

    setPendingUser(targetUser.id);
    try {
      await deleteUser(targetUser.id);
      setUsers((current) => current.filter((item) => item.id !== targetUser.id));
      pushToast('Користувача видалено', targetUser.login);
    } catch (error) {
      pushToast('Не вдалося видалити користувача', String(error));
    } finally {
      setPendingUser(null);
    }
  };

  return (
    <div className="admin-card">
      <h2 style={{ marginTop: 0 }}>Користувачі</h2>
      {!isRootAdmin ? (
        <div style={{ marginBottom: 16, color: '#6c757d' }}>
          Ви маєте доступ до адміністративної панелі, але тільки головний адміністратор може керувати ролями та видаляти користувачів.
        </div>
      ) : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Логін</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Дата реєстрації</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0' }}>
                  Завантаження...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0' }}>
                  Користувачів не знайдено.
                </td>
              </tr>
            ) : (
              users.map((currentUser) => {
                const isCurrentUser = user?.userId === currentUser.id;
                const isPending = pendingUser === currentUser.id;

                return (
                  <tr key={currentUser.id}>
                    <td>{currentUser.login}</td>
                    <td>{currentUser.email}</td>
                    <td>{currentUser.role === 'admin' ? 'Адміністратор' : 'Користувач'}</td>
                    <td>{formatDateCompact(currentUser.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm"
                          disabled={!isRootAdmin || isPending || currentUser.login === 'admin'}
                          onClick={() => handleToggleRole(currentUser)}
                        >
                          {currentUser.role === 'admin' ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                          {currentUser.role === 'admin' ? 'Забрати права' : 'Надати права'}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          disabled={isPending || isCurrentUser}
                          onClick={() => handleDeleteUser(currentUser)}
                        >
                          <Trash2 size={14} /> Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
