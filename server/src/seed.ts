import bcrypt from 'bcrypt';
import { logger } from './utils/logger';
import { execute, query } from './db';

function svgImage(title: string, emoji: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#fff7ed"/>
          <stop offset="100%" stop-color="${accent}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="560" rx="36" fill="url(#bg)"/>
      <circle cx="668" cy="98" r="84" fill="rgba(255,255,255,0.42)"/>
      <circle cx="120" cy="440" r="114" fill="rgba(255,255,255,0.22)"/>
      <text x="400" y="248" text-anchor="middle" font-size="128">${emoji}</text>
      <text x="400" y="338" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#1f2937">${title}</text>
      <text x="400" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#374151">ШвидкоFood</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

interface SeedProduct {
  id: string;
  title: string;
  description: string;
  composition: string;
  category: string;
  basePrice: number;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  rating: number;
  prepTime: number;
  sizes?: Array<{ id: string; label: string; priceModifier: number }>;
  addons?: Array<{ id: string; label: string; price: number }>;
}

const categories = [
  { id: crypto.randomUUID(), name: 'Бургери', slug: 'burgers' },
  { id: crypto.randomUUID(), name: 'Піца', slug: 'pizza' },
  { id: crypto.randomUUID(), name: 'Снеки', slug: 'snacks' },
  { id: crypto.randomUUID(), name: 'Напої', slug: 'drinks' },
  { id: crypto.randomUUID(), name: 'Соуси', slug: 'sauces' },
  { id: crypto.randomUUID(), name: 'Десерти', slug: 'desserts' },
];

const products: SeedProduct[] = [
  {
    id: 'burger-classic',
    title: 'Класичний бургер',
    description: 'Соковита яловича котлета, сир чедер, фірмовий соус та хрусткий салат.',
    composition: 'Булочка бріош, яловичина, салат, томат, сир чедер, соус бургер',
    category: 'Бургери',
    basePrice: 169,
    image: svgImage('Класичний бургер', '🍔', '#fdba74'),
    isAvailable: true,
    isPopular: true,
    rating: 4.9,
    prepTime: 12,
    sizes: [
      { id: 'standard', label: 'Стандарт', priceModifier: 0 },
      { id: 'double', label: 'Подвійний', priceModifier: 55 },
    ],
    addons: [
      { id: 'bacon', label: 'Бекон', price: 28 },
      { id: 'jalapeno', label: 'Халапеньйо', price: 18 },
      { id: 'extra-cheese', label: 'Додатковий сир', price: 22 },
    ],
  },
  {
    id: 'burger-bbq',
    title: 'BBQ бургер',
    description: 'Ароматна котлета, карамелізована цибуля та густий BBQ соус.',
    composition: 'Булочка, яловичина, цибуля, бекон, сир, соус BBQ',
    category: 'Бургери',
    basePrice: 189,
    image: svgImage('BBQ бургер', '🥓', '#fb923c'),
    isAvailable: true,
    isNew: true,
    rating: 4.8,
    prepTime: 14,
    sizes: [
      { id: 'standard', label: 'Стандарт', priceModifier: 0 },
      { id: 'double', label: 'Подвійний', priceModifier: 60 },
    ],
    addons: [
      { id: 'onion-rings', label: 'Цибулеві кільця', price: 26 },
      { id: 'extra-bbq', label: 'Подвійний BBQ соус', price: 16 },
    ],
  },
  {
    id: 'pizza-pepperoni',
    title: 'Піца Пепероні',
    description: 'Тонке тісто, томатний соус, сир моцарела та пепероні.',
    composition: 'Тісто, соус томатний, моцарела, пепероні, орегано',
    category: 'Піца',
    basePrice: 249,
    image: svgImage('Піца Пепероні', '🍕', '#f97316'),
    isAvailable: true,
    isPopular: true,
    rating: 4.9,
    prepTime: 18,
    sizes: [
      { id: 'small', label: '30 см', priceModifier: 0 },
      { id: 'large', label: '40 см', priceModifier: 85 },
    ],
    addons: [
      { id: 'extra-pepperoni', label: 'Подвійне пепероні', price: 39 },
      { id: 'extra-cheese', label: 'Більше моцарели', price: 30 },
      { id: 'olives', label: 'Оливки', price: 22 },
    ],
  },
  {
    id: 'pizza-4cheese',
    title: 'Піца 4 сири',
    description: 'Ніжний смак сирного міксу на вершковій основі.',
    composition: 'Тісто, вершковий соус, моцарела, дорблю, пармезан, гауда',
    category: 'Піца',
    basePrice: 269,
    image: svgImage('Піца 4 сири', '🧀', '#fdba74'),
    isAvailable: true,
    rating: 4.7,
    prepTime: 18,
    sizes: [
      { id: 'small', label: '30 см', priceModifier: 0 },
      { id: 'large', label: '40 см', priceModifier: 90 },
    ],
    addons: [
      { id: 'blue-cheese', label: 'Додатковий дорблю', price: 36 },
      { id: 'pear', label: 'Груша', price: 24 },
    ],
  },
  {
    id: 'snack-fries',
    title: 'Картопля фрі',
    description: 'Золота картопля з хрусткою скоринкою.',
    composition: 'Картопля, сіль, спеції',
    category: 'Снеки',
    basePrice: 89,
    image: svgImage('Картопля фрі', '🍟', '#f59e0b'),
    isAvailable: true,
    isPopular: true,
    rating: 4.8,
    prepTime: 7,
    sizes: [
      { id: 'small', label: 'Мала', priceModifier: 0 },
      { id: 'large', label: 'Велика', priceModifier: 32 },
    ],
    addons: [
      { id: 'cheese-sauce', label: 'Сирний соус', price: 18 },
      { id: 'paprika', label: 'Копчена паприка', price: 12 },
    ],
  },
  {
    id: 'snack-nuggets',
    title: 'Курячі нагетси',
    description: 'Ніжне куряче філе в хрусткій паніровці.',
    composition: 'Куряче філе, паніровка, спеції',
    category: 'Снеки',
    basePrice: 119,
    image: svgImage('Курячі нагетси', '🍗', '#fbbf24'),
    isAvailable: true,
    rating: 4.6,
    prepTime: 10,
    sizes: [
      { id: '6', label: '6 шт', priceModifier: 0 },
      { id: '9', label: '9 шт', priceModifier: 45 },
    ],
    addons: [
      { id: 'sweet-chili', label: 'Соус солодкий чилі', price: 18 },
      { id: 'bbq', label: 'BBQ соус', price: 18 },
    ],
  },
  {
    id: 'drink-cola',
    title: 'Кола',
    description: 'Освіжаючий газований напій.',
    composition: 'Кола',
    category: 'Напої',
    basePrice: 49,
    image: svgImage('Кола', '🥤', '#fb7185'),
    isAvailable: true,
    rating: 4.7,
    prepTime: 2,
    sizes: [
      { id: '0.33', label: '0.33 л', priceModifier: 0 },
      { id: '0.5', label: '0.5 л', priceModifier: 15 },
      { id: '0.75', label: '0.75 л', priceModifier: 27 },
    ],
  },
  {
    id: 'drink-lemonade',
    title: 'Лимонад манго-маракуя',
    description: 'Фірмовий лимонад з яскравим фруктовим смаком.',
    composition: 'Пюре манго, маракуя, лід, вода, мʼята',
    category: 'Напої',
    basePrice: 79,
    image: svgImage('Лимонад', '🍹', '#fca5a5'),
    isAvailable: true,
    isNew: true,
    rating: 4.9,
    prepTime: 4,
    sizes: [
      { id: '0.4', label: '0.4 л', priceModifier: 0 },
      { id: '0.7', label: '0.7 л', priceModifier: 24 },
    ],
    addons: [{ id: 'ice', label: 'Додатковий лід', price: 0 }],
  },
  {
    id: 'sauce-cheese',
    title: 'Сирний соус',
    description: 'Ніжний вершково-сирний соус до закусок.',
    composition: 'Сирний соус',
    category: 'Соуси',
    basePrice: 25,
    image: svgImage('Сирний соус', '🫕', '#fcd34d'),
    isAvailable: true,
    rating: 4.6,
    prepTime: 1,
  },
  {
    id: 'sauce-garlic',
    title: 'Часниковий соус',
    description: 'Пікантний соус із мʼяким вершковим смаком.',
    composition: 'Часник, вершки, спеції',
    category: 'Соуси',
    basePrice: 25,
    image: svgImage('Часниковий соус', '🧄', '#fde68a'),
    isAvailable: true,
    rating: 4.5,
    prepTime: 1,
  },
  {
    id: 'dessert-brownie',
    title: 'Шоколадний брауні',
    description: 'Насичений шоколадний десерт з ніжною текстурою.',
    composition: 'Шоколад, вершкове масло, какао, борошно',
    category: 'Десерти',
    basePrice: 95,
    image: svgImage('Шоколадний брауні', '🍫', '#a16207'),
    isAvailable: true,
    isPopular: true,
    rating: 4.8,
    prepTime: 3,
    addons: [
      { id: 'ice-cream', label: 'Кулька морозива', price: 25 },
      { id: 'caramel', label: 'Карамельний топінг', price: 18 },
    ],
  },
  {
    id: 'dessert-cheesecake',
    title: 'Чизкейк Нью-Йорк',
    description: 'Класичний вершковий десерт із ягідним соусом.',
    composition: 'Сир кремовий, вершки, печиво, ягідний соус',
    category: 'Десерти',
    basePrice: 109,
    image: svgImage('Чизкейк', '🍰', '#f9a8d4'),
    isAvailable: true,
    rating: 4.9,
    prepTime: 3,
    addons: [{ id: 'berries', label: 'Свіжі ягоди', price: 26 }],
  },
  {
    id: 'burger-chicken',
    title: 'Чікен бургер',
    description: 'Соковите куряче філе, овочі та медово-гірчичний соус.',
    composition: 'Булочка, куряче філе, салат, томат, соус медово-гірчичний',
    category: 'Бургери',
    basePrice: 159,
    image: svgImage('Чікен бургер', '🍔', '#fb923c'),
    isAvailable: true,
    rating: 4.7,
    prepTime: 12,
    sizes: [
      { id: 'standard', label: 'Стандарт', priceModifier: 0 },
      { id: 'double', label: 'Подвійний', priceModifier: 49 },
    ],
    addons: [
      { id: 'pickles', label: 'Мариновані огірки', price: 15 },
      { id: 'cheese', label: 'Сир чедер', price: 22 },
    ],
  },
  {
    id: 'pizza-veggie',
    title: 'Піца Веггі',
    description: 'Овочева піца з томатами, перцем та кукурудзою.',
    composition: 'Тісто, томатний соус, моцарела, томати, перець, кукурудза, гриби',
    category: 'Піца',
    basePrice: 229,
    image: svgImage('Піца Веггі', '🥬', '#86efac'),
    isAvailable: true,
    isNew: true,
    rating: 4.5,
    prepTime: 17,
    sizes: [
      { id: 'small', label: '30 см', priceModifier: 0 },
      { id: 'large', label: '40 см', priceModifier: 79 },
    ],
    addons: [
      { id: 'mushrooms', label: 'Печериці', price: 22 },
      { id: 'feta', label: 'Сир фета', price: 28 },
    ],
  },
  {
    id: 'snack-onion-rings',
    title: 'Цибулеві кільця',
    description: 'Хрусткі кільця в легкій паніровці.',
    composition: 'Цибуля, паніровка, спеції',
    category: 'Снеки',
    basePrice: 99,
    image: svgImage('Цибулеві кільця', '🧅', '#fbbf24'),
    isAvailable: true,
    rating: 4.4,
    prepTime: 8,
    addons: [
      { id: 'bbq', label: 'BBQ соус', price: 18 },
      { id: 'garlic', label: 'Часниковий соус', price: 18 },
    ],
  },
  {
    id: 'drink-coffee',
    title: 'Капучино',
    description: 'Ароматна кава з ніжною молочною пінкою.',
    composition: 'Еспресо, молоко',
    category: 'Напої',
    basePrice: 65,
    image: svgImage('Капучино', '☕', '#fed7aa'),
    isAvailable: true,
    rating: 4.8,
    prepTime: 4,
    sizes: [
      { id: 'small', label: '250 мл', priceModifier: 0 },
      { id: 'large', label: '350 мл', priceModifier: 18 },
    ],
    addons: [
      { id: 'syrup', label: 'Карамельний сироп', price: 14 },
      { id: 'vegetable-milk', label: 'Рослинне молоко', price: 18 },
    ],
  },
  {
    id: 'dessert-icecream',
    title: 'Морозиво карамельне',
    description: 'Легкий холодний десерт із карамельним топінгом.',
    composition: 'Морозиво, карамель, мигдальні пластівці',
    category: 'Десерти',
    basePrice: 85,
    image: svgImage('Морозиво', '🍨', '#f9a8d4'),
    isAvailable: true,
    rating: 4.7,
    prepTime: 2,
    addons: [
      { id: 'nuts', label: 'Горіхи', price: 18 },
      { id: 'chocolate', label: 'Шоколадний топінг', price: 18 },
    ],
  },
];

const settings = {
  siteName: 'ШвидкоFood',
  siteDescription:
    'Сучасний заклад швидкого харчування в Полтаві: бургери, піца, снеки та напої з доставкою або самовивозом.',
  address: 'м. Полтава, вул. Соборний майдан, 1',
  phone: '+380 (99) 123-45-67',
  email: 'info@shvydkofood.ua',
  workingHours: 'Щодня з 09:00 до 22:00',
};

export async function ensureSeedData() {
  const existingCategories = await query('SELECT TOP 1 id FROM Categories');
  if (!existingCategories.length) {
    for (const category of categories) {
      await execute('INSERT INTO Categories (id, name, slug) VALUES (@id, @name, @slug)', {
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
    }
  }

  const existingProducts = await query('SELECT TOP 1 id FROM Products');
  if (!existingProducts.length) {
    const categoryByName = Object.fromEntries(categories.map((category) => [category.name, category.id]));
    for (const product of products) {
      await execute(
        `INSERT INTO Products (id, name, description, composition, categoryId, price, imageUrl, isAvailable, cookingTime, tags, sizes, addons, isPopular, isNew, isPromo, rating, createdAt, updatedAt)
         VALUES (@id, @name, @description, @composition, @categoryId, @price, @imageUrl, @isAvailable, @cookingTime, @tags, @sizes, @addons, @isPopular, @isNew, @isPromo, @rating, SYSUTCDATETIME(), SYSUTCDATETIME())`,
        {
          id: crypto.randomUUID(),
          name: product.title,
          description: product.description,
          composition: product.composition,
          categoryId: categoryByName[product.category],
          price: product.basePrice,
          imageUrl: product.image,
          isAvailable: product.isAvailable ? 1 : 0,
          cookingTime: product.prepTime,
          tags: JSON.stringify([]),
          sizes: JSON.stringify(product.sizes ?? []),
          addons: JSON.stringify(product.addons ?? []),
          isPopular: product.isPopular ? 1 : 0,
          isNew: product.isNew ? 1 : 0,
          isPromo: product.isPromo ? 1 : 0,
          rating: Math.round(product.rating || 0),
        },
      );
    }
  }

  const existingSettings = await query('SELECT TOP 1 id FROM Settings');
  if (!existingSettings.length) {
    await execute(
      `INSERT INTO Settings (id, siteName, siteDescription, address, phone, email, workingHours, createdAt, updatedAt)
       VALUES (@id, @siteName, @siteDescription, @address, @phone, @email, @workingHours, SYSUTCDATETIME(), SYSUTCDATETIME())`,
      {
        id: crypto.randomUUID(),
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        workingHours: settings.workingHours,
      },
    );
  }

  const existingAdmin = await query('SELECT TOP 1 id FROM Users WHERE username = @login', { login: 'admin' });
  if (!existingAdmin.length) {
    const passwordHash = await bcrypt.hash('admin', 10);
    await execute(
      `INSERT INTO Users (id, username, email, passwordHash, role, createdAt) VALUES (@id, @login, @email, @passwordHash, @role, SYSUTCDATETIME())`,
      {
        id: crypto.randomUUID(),
        login: 'admin',
        email: 'admin@fastfood.local',
        passwordHash,
        role: 'admin',
      },
    );
  }
}

if (require.main === module) {
  ensureSeedData()
    .then(() => {
      logger.info('Seed completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seed execution failed:', error);
      process.exit(1);
    });
}
