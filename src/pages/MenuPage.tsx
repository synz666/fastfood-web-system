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
  const { products, categories: menuCategories } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<Category | 'усе'>('усе');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const order = menuCategories.map((category) => category.name);
    const fromProducts = products.map((product) => product.category);
    const unique = Array.from(new Set([...order, ...fromProducts]));
    return unique.sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b, 'uk');
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [menuCategories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory !== 'усе' && product.category !== activeCategory) return false;
      if (!productMatchesQuery(product, query)) return false;
      return true;
    });
  }, [activeCategory, products, query]);

  return (
    <div className="page-grid">
      <SectionTitle
        eyebrow="Каталог"
        title="Меню закладу"
        description="Оберіть категорію, знайдіть страву за назвою та додайте до кошика з потрібними додатками."
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
