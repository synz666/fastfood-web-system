# «ШвидкоFood» — дипломний проект

Кваліфікаційна робота на підтвердження ступеня фахового молодшого бакалавра.

- Автор: **Семенко Іван**
- Керівник: **Ковальова Наталія Володимирівна**
- Навчальний заклад: ВСП «ППФК НТУ «ХПІ»
- Група: 45

## Опис проєкту

«ШвидкоFood» — веб-орієнтована інформаційна система для закладу швидкого харчування.
Фронтенд побудовано на React + Vite + TypeScript, бекенд — на Node.js + Express + TypeScript, база даних — Microsoft SQL Server.

## Основні можливості користувача

- перегляд меню з категоріями;
- вибір товару з різними розмірами та додатками;
- динамічний розрахунок ціни;
- кошик з редагуванням кількості;
- оформлення замовлення;
- історія власних замовлень;
- реєстрація та вхід у систему.

## Можливості адміністратора

- управління товарами (додавання, редагування, видалення);
- управління категоріями;
- перегляд та оновлення статусів замовлень;
- налаштування контактних даних і опису сайту;
- доступ до адмін-панелі після входу під обліковим записом адміністратора.

## Технології

Frontend:
- React 18
- Vite
- TypeScript
- CSS

Backend:
- Node.js
- Express
- TypeScript
- JWT (автентифікація)
- bcrypt (хешування паролів)

База даних:
- Microsoft SQL Server Express
- `mssql`, `msnodesqlv8`

Інструменти:
- Visual Studio Code
- Git
- GitHub
- npm

## Структура проєкту

- `src/` — фронтенд
  - `src/api/` — модулі виклику API
  - `src/components/` — компоненти інтерфейсу
  - `src/pages/` — сторінки застосунку
  - `src/context/` — контексти для стану й авторизації
  - `src/hooks/` — користувацькі хуки
  - `src/utils/` — допоміжні утиліти
  - `src/admin/` — адміністративна частина
- `server/` — бекенд
  - `server/src/` — серверний код
  - `server/src/routes/` — маршрути API
  - `server/scripts/` — допоміжні утиліти
  - `server/migrations/` — SQL-скрипти для схеми
- `public/` — статичні ресурси
- `database/` — SQL-скрипти для відновлення бази даних

## База даних

Система використовує базу даних `ShvydkoFoodDb` у Microsoft SQL Server Express.

Основні таблиці:
- `Users` — користувачі
- `Categories` — категорії меню
- `Products` — товари
- `Orders` — замовлення
- `OrderItems` — позиції замовлень
- `Settings` — налаштування сайту

## Файли SQL

- `database/schema.sql` — структура таблиць
- `database/seed.sql` — приклад стартових даних
- `server/migrations/0001-initial-schema.sql` — додатковий скрипт створення схеми

## Налаштування змінних середовища

### Фронтенд

Створіть файл `./.env` зі значеннями з `./.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Бекенд

Створіть файл `server/.env` зі значеннями з `server/.env.example`:

```env
PORT=5000
DB_SERVER=YOUR_SERVER\\SQLEXPRESS
DB_DATABASE=ShvydkoFoodDb
DB_TRUSTED_CONNECTION=true
# Якщо не використовуєте довірене з'єднання:
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_ENCRYPT=true
JWT_SECRET=change_me_later
```

> Увага: не додавайте реальні паролі, JWT-секрети чи дані доступу до репозиторію.

## Запуск фронтенду

```bash
cd fastfood-is
npm install
npm run dev
```

## Запуск бекенду

```bash
cd fastfood-is/server
npm install
npm run dev
```

## Налаштування SQL Server

1. Встановіть Microsoft SQL Server Express і SQL Server Management Studio.
2. Створіть базу `ShvydkoFoodDb`.
3. Виконайте `database/schema.sql`.
4. Виконайте `database/seed.sql` або запустіть `npm run seed` у каталозі `server`.

## Перевірка API

- `http://localhost:5000/`
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/products`
- `http://localhost:5000/api/categories`

## Дані для входу адміністратора

- Логін: `admin`
- Пароль: `admin`

## Файли, які не повинні додаватися до GitHub

- `.env`
- `server/.env`
- `node_modules/`
- `dist/`
- `build/`
- `*.tsbuildinfo`
- `*.mdf`
- `*.ldf`
- `*.bak`
- `*.trn`
- `.vscode/`
- `.DS_Store`
- `Thumbs.db`

## Подальші напрямки розвитку

- додати автоматичні тести та lint-налаштування;
- розширити рольову модель та права доступу;
- підготувати CI/CD для розгортання;
- покращити аналітику та логування.
