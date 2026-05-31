import { Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export function CategoriesPage() {
  const { categories, products, addCategory, renameCategory, deleteCategory } = useAppContext();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    addCategory(newName);
    setNewName('');
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = () => {
    if (editingId) {
      renameCategory(editingId, editingName);
      setEditingId(null);
      setEditingName('');
    }
  };

  return (
    <div className="admin-card">
      <h2 style={{ marginTop: 0 }}>Категорії меню</h2>

      <form className="admin-toolbar" onSubmit={handleAdd}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Назва нової категорії"
          style={{ flex: 1, minWidth: 220 }}
        />
        <button type="submit" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Додати категорію
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Товарів</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const count = products.filter((product) => product.category === category.name).length;
              const isEditing = editingId === category.id;

              return (
                <tr key={category.id}>
                  <td>
                    {isEditing ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>{count}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {isEditing ? (
                        <button type="button" className="admin-btn admin-btn-sm admin-btn-primary" onClick={saveEdit}>
                          Зберегти
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm"
                          onClick={() => startEdit(category.id, category.name)}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
