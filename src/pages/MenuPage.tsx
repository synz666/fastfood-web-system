import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CategoryChips } from '../components/CategoryChips';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import type { Category, Product } from '../types';
import { productMatchesQuery } from '../utils/product';

export function MenuPage() {
  const { products } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<Category | 'усе'>('усе');
  const [query, setQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory !== 'усе' && product.category !== activeCategory) return false;
      if (!productMatchesQuery(product, query)) return false;
      if (onlyAvailable && !product.isAvailable) return false;
      return true;
    });
  }, [activeCategory, products, query, onlyAvailable]);

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Каталог"
        title="Інтерактивне меню"
        description="Пошук, категорії, модифікатори товарів та динамічний перерахунок вартості."
      />

      <section className="toolbar-panel">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Пошук за назвою, описом або складом"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <label className="switch-row">
          <input type="checkbox" checked={onlyAvailable} onChange={() => setOnlyAvailable((value) => !value)} />
          <span>Показувати лише наявні товари</span>
        </label>
      </section>

      <CategoryChips categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />

      {filteredProducts.length ? (
        <div className="cards-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Нічого не знайдено"
          description="Спробуйте змінити категорію або пошуковий запит, щоб побачити доступні товари."
        />
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
