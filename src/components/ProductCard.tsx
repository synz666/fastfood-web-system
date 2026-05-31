import { Clock3, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { Badge } from './Badge';

interface Props {
  product: Product;
  onOpen: (product: Product) => void;
}

export function ProductCard({ product, onOpen }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className={`product-card ${!product.isAvailable ? 'product-unavailable' : ''}`}>
      <div className="product-image-wrap">
        {!imageError ? (
          <img src={product.image} alt={product.title} className="product-image" onError={() => setImageError(true)} />
        ) : (
          <div className="image-fallback" aria-hidden>{product.title?.charAt(0) ?? '🍽'}</div>
        )}
        <div className="product-badges">
          {product.isPopular ? <Badge tone="accent">Хіт</Badge> : null}
          {product.isNew ? <Badge tone="success">Новинка</Badge> : null}
          {!product.isAvailable ? <Badge>Немає в наявності</Badge> : null}
        </div>
      </div>
      <div className="product-body">
        <div className="product-header">
          <div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
          </div>
          <span className="price-pill">{formatPrice(product.basePrice)}</span>
        </div>
        <div className="product-meta">
          <span><Clock3 size={16} /> {product.prepTime} хв</span>
        </div>
        <button className="btn btn-primary product-action" type="button" onClick={() => onOpen(product)}>
          Детальніше <Plus size={18} />
        </button>
      </div>
    </article>
  );
}
