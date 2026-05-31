import type { Category } from '../types';

interface Props {
  categories: Category[];
  activeCategory: Category | 'усе';
  onChange: (value: Category | 'усе') => void;
}

export function CategoryChips({ categories, activeCategory, onChange }: Props) {
  return (
    <div className="chips-row">
      <button
        className={`chip ${activeCategory === 'усе' ? 'active' : ''}`}
        onClick={() => onChange('усе')}
        type="button"
      >
        Усе меню
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`chip ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onChange(category)}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
