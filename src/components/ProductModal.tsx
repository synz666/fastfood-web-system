import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Product, ProductAddon, ProductSize } from '../types';
import { formatPrice } from '../utils/formatters';
import { calculateProductPrice } from '../utils/product';
import { useAppContext } from '../context/AppContext';
import { Badge } from './Badge';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useAppContext();
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(product?.sizes?.[0]);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedSize(product?.sizes?.[0]);
    setSelectedAddons([]);
    setQuantity(1);
  }, [product]);

  const price = useMemo(() => {
    if (!product) return 0;
    return calculateProductPrice(product, selectedSize, selectedAddons);
  }, [product, selectedSize, selectedAddons]);

  if (!product) return null;

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((current) =>
      current.some((item) => item.id === addon.id)
        ? current.filter((item) => item.id !== addon.id)
        : [...current, addon],
    );
  };

  const handleAdd = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart({ product, size: selectedSize, addons: selectedAddons });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Закрити">
          <X size={20} />
        </button>
        <div className="modal-layout">
          <img src={product.image} alt={product.title} className="modal-image" />
          <div className="modal-content">
            <div className="inline-row">
              <h2>{product.title}</h2>
              <div className="inline-row compact">
                {product.isPopular ? <Badge tone="accent">Хіт</Badge> : null}
                {product.isNew ? <Badge tone="success">Новинка</Badge> : null}
              </div>
            </div>
            <p>{product.description}</p>
            <div className="detail-box">
              <strong>Склад:</strong>
              <span>{product.composition}</span>
            </div>

            {product.sizes?.length ? (
              <div>
                <h3 className="block-title">Оберіть розмір</h3>
                <div className="option-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      className={`option-card ${selectedSize?.id === size.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <span>{size.label}</span>
                      <strong>{size.priceModifier > 0 ? `+${formatPrice(size.priceModifier)}` : 'Без доплати'}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {product.addons?.length ? (
              <div>
                <h3 className="block-title">Додатки та інгредієнти</h3>
                <div className="option-grid">
                  {product.addons.map((addon) => {
                    const active = selectedAddons.some((item) => item.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        className={`option-card ${active ? 'selected' : ''}`}
                        onClick={() => toggleAddon(addon)}
                      >
                        <span>{addon.label}</span>
                        <strong>{addon.price === 0 ? 'Безкоштовно' : `+${formatPrice(addon.price)}`}</strong>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="purchase-panel">
              <div>
                <span className="muted">Поточна ціна</span>
                <div className="total-price">{formatPrice(price)}</div>
              </div>
              <div className="quantity-box">
                <button type="button" className="icon-button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus size={16} />
                </button>
                <strong>{quantity}</strong>
                <button type="button" className="icon-button" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-full" type="button" onClick={handleAdd} disabled={!product.isAvailable}>
              Додати до кошика на {formatPrice(price * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
