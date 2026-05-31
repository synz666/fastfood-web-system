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
          description="Добірка страв, які найчастіше замовляють наші гості."
        />
        <div className="cards-grid">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
          ))}
        </div>
      </section>

      <section className="promo-panel">
        <div>
          <span className="eyebrow">Чому обирають нас</span>
          <h2>Смачно, швидко та без зайвих кроків</h2>
          <p>
            Знайдіть улюблену страву в меню, додайте соуси та напої, оформіть доставку або самовивіз
            і повертайтеся до історії замовлень, коли захочете повторити улюблене.
          </p>
        </div>
        <div className="promo-actions">
          <Link to="/menu" className="btn btn-primary">Переглянути меню</Link>
          <Link to="/cart" className="btn btn-secondary">Перейти до кошика</Link>
        </div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
