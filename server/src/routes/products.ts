import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { execute, query } from '../db';
import { ensureArray, isGuid } from '../utils/normalize';
import { logger } from '../utils/logger';

export const productsRouter = Router();

// use shared parser ensureArray from utils

function parseProduct(row: any) {
  return {
    id: row.id,
    title: row.name,
    description: row.description,
    composition: row.composition || '',
    category: row.categoryName,
    categoryId: row.categoryId,
    basePrice: Number(row.price),
    image: row.imageUrl,
    isAvailable: Boolean(row.isAvailable),
    isPopular: Boolean(row.isPopular),
    isNew: Boolean(row.isNew),
    isPromo: Boolean(row.isPromo),
    rating: Number(row.rating),
    prepTime: Number(row.cookingTime),
    sizes: ensureArray(row.sizes),
    addons: ensureArray(row.addons),
    tags: ensureArray(row.tags),
  };
}

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

productsRouter.get('/', async (_req, res) => {
  try {
    const items = await query(
      `SELECT p.*, c.name AS categoryName
       FROM Products p
       LEFT JOIN Categories c ON p.categoryId = c.id
       ORDER BY p.name`,
    );
    res.json(items.map(parseProduct));
  } catch (error) {
    logger.error('Failed to fetch products:', error);
    res.status(500).json({ message: 'Не вдалося отримати товари' });
  }
});

productsRouter.get('/:id', async (req, res) => {
  const productId = String(req.params.id || '').trim();
  if (!guidRegex.test(productId)) {
    return res.status(400).json({ message: 'Некоректний ID товару' });
  }

  const [item] = await query(
    `SELECT p.*, c.name AS categoryName
     FROM Products p
     LEFT JOIN Categories c ON p.categoryId = c.id
     WHERE p.id = @id`,
    { id: productId },
  );

  if (!item) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(parseProduct(item));
});

productsRouter.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const payload = req.body;
  const categoryId = String(payload.categoryId ?? payload.category ?? '').trim();

  if (!categoryId || !isGuid(categoryId)) {
    return res.status(400).json({ message: 'Некоректна категорія товару' });
  }

  const categoryRow = await query('SELECT id FROM Categories WHERE id = @id', { id: categoryId });
  if (!categoryRow.length) {
    return res.status(400).json({ message: 'Некоректна категорія товару' });
  }

  const id = crypto.randomUUID();
  await execute(
    `INSERT INTO Products (id, name, description, composition, categoryId, price, imageUrl, isAvailable, cookingTime, tags, sizes, addons, isPopular, isNew, isPromo, rating, createdAt, updatedAt)
     VALUES (@id, @name, @description, @composition, @categoryId, @price, @imageUrl, @isAvailable, @cookingTime, @tags, @sizes, @addons, @isPopular, @isNew, @isPromo, @rating, SYSUTCDATETIME(), SYSUTCDATETIME())`,
    {
      id,
      name: String(payload.title || ''),
      description: String(payload.description || ''),
      composition: String(payload.composition || ''),
      categoryId: categoryRow[0].id,
      price: Number(payload.basePrice || 0),
      imageUrl: String(payload.image || ''),
      isAvailable: payload.isAvailable ? 1 : 0,
      cookingTime: Number(payload.prepTime || 0),
      tags: JSON.stringify(Array.isArray(payload.tags) ? payload.tags : []),
      sizes: JSON.stringify(Array.isArray(payload.sizes) ? payload.sizes : []),
      addons: JSON.stringify(Array.isArray(payload.addons) ? payload.addons : []),
      isPopular: payload.isPopular ? 1 : 0,
      isNew: payload.isNew ? 1 : 0,
      isPromo: payload.isPromo ? 1 : 0,
      rating: Number(payload.rating ?? 0),
    },
  );

  const [created] = await query(
    `SELECT p.*, c.name AS categoryName FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id WHERE p.id = @id`,
    { id },
  );
  res.status(201).json(parseProduct(created));
});

productsRouter.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const productId = String(req.params.id || '').trim();
  if (!guidRegex.test(productId)) {
    return res.status(400).json({ message: 'Некоректний ID товару' });
  }

  const payload = req.body;
  const categoryId = String(payload.categoryId ?? payload.category ?? '').trim();

  if (!categoryId || !guidRegex.test(categoryId)) {
    return res.status(400).json({ message: 'Некоректна категорія товару' });
  }

  const categoryRow = await query('SELECT id FROM Categories WHERE id = @id', { id: categoryId });
  if (!categoryRow.length) {
    return res.status(400).json({ message: 'Некоректна категорія товару' });
  }

  await execute(
    `UPDATE Products SET
       name = @name,
       description = @description,
       composition = @composition,
       categoryId = @categoryId,
       price = @price,
       imageUrl = @imageUrl,
       isAvailable = @isAvailable,
       cookingTime = @cookingTime,
       tags = @tags,
       sizes = @sizes,
       addons = @addons,
       isPopular = @isPopular,
       isNew = @isNew,
       isPromo = @isPromo,
       rating = @rating,
       updatedAt = SYSUTCDATETIME()
     WHERE id = @id`,
    {
      id: productId,
      name: String(payload.title || ''),
      description: String(payload.description || ''),
      composition: String(payload.composition || ''),
      categoryId: categoryRow[0].id,
      price: Number(payload.basePrice || 0),
      imageUrl: String(payload.image || ''),
      isAvailable: payload.isAvailable ? 1 : 0,
      cookingTime: Number(payload.prepTime || 0),
      tags: JSON.stringify(Array.isArray(payload.tags) ? payload.tags : []),
      sizes: JSON.stringify(Array.isArray(payload.sizes) ? payload.sizes : []),
      addons: JSON.stringify(Array.isArray(payload.addons) ? payload.addons : []),
      isPopular: payload.isPopular ? 1 : 0,
      isNew: payload.isNew ? 1 : 0,
      isPromo: payload.isPromo ? 1 : 0,
      rating: Number(payload.rating ?? 0),
    },
  );

  const [updated] = await query(
    `SELECT p.*, c.name AS categoryName FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id WHERE p.id = @id`,
    { id: productId },
  );

  if (!updated) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(parseProduct(updated));
});

productsRouter.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const productId = String(req.params.id || '').trim();
  if (!guidRegex.test(productId)) {
    return res.status(400).json({ message: 'Некоректний ID товару' });
  }

  const [existing] = await query('SELECT id FROM Products WHERE id = @id', { id: productId });
  if (!existing) {
    return res.status(404).json({ message: 'Товар не знайдено' });
  }

  const [dependentOrderItem] = await query('SELECT TOP 1 id FROM OrderItems WHERE productId = @id', {
    id: productId,
  });

  if (dependentOrderItem) {
    await execute('UPDATE Products SET isAvailable = 0 WHERE id = @id', { id: productId });
    return res.status(204).send();
  }

  await execute('DELETE FROM Products WHERE id = @id', { id: productId });
  res.status(204).send();
});
