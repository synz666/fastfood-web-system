import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import type { Product } from '../types';
import { useMemo, useState } from 'react';

export function HomePage() {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const popular = useMemo(
    () => products.filter((product) => product.isAvailable && (product.isPopular || product.isNew)).slice(0, 6),
    [products],
  );

  return (
    <div className="page-grid">
      <Hero />

      <section>
        <SectionTitle
          eyebrow="Популярні пропозиції"
          title="Хіти продажів та новинки"
          description="Добірка позицій, які найчастіше обирають користувачі системи."
        />
        <div className="cards-grid">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
          ))}
        </div>
      </section>

      <section className="promo-panel">
        <div>
          <span className="eyebrow">Можливості системи</span>
          <h2>Один сайт — і для клієнта, і для адміністратора меню</h2>
          <p>
            Користувач може знайти страву, налаштувати розмір та додатки, а адміністратор — редагувати
            картки меню, ціни, наявність та описи без перезапуску сайту.
          </p>
        </div>
        <div className="promo-actions">
          <Link to="/menu" className="btn btn-primary">Переглянути меню</Link>
          <Link to="/checkout" className="btn btn-secondary">Оформити замовлення</Link>
        </div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
