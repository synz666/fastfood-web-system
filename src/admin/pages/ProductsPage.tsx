import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';

export function ProductsPage() {
  const { products, deleteProduct, resetProductsToSeed } = useAppContext();

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <div className="admin-card-header" style={{ marginBottom: 0 }}>
          <h2>Каталог товарів</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
            <Plus size={16} /> Додати товар
          </Link>
          <button type="button" className="admin-btn" onClick={resetProductsToSeed}>
            <RotateCcw size={16} /> Відновити початкове меню
          </button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Назва</th>
              <th>Категорія</th>
              <th>Ціна</th>
              <th>Наявність</th>
              <th>Час</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.title} className="admin-product-thumb" />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
                    {product.isPopular ? 'Хіт ' : ''}
                    {product.isNew ? 'Новинка ' : ''}
                    {product.isPromo ? 'Акція' : ''}
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{formatPrice(product.basePrice)}</td>
                <td>{product.isAvailable ? 'У наявності' : 'Немає'}</td>
                <td>{product.prepTime} хв</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/products/${product.id}/edit`} className="admin-btn admin-btn-sm">
                      <Pencil size={14} /> Редагувати
                    </Link>
                    <button
                      type="button"
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
