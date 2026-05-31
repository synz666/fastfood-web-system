import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { execute, query } from '../db';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res) => {
  const items = await query('SELECT id, name, slug FROM Categories ORDER BY name');
  res.json(items);
});

categoriesRouter.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  const slug = String(req.body.slug || name.toLowerCase().replace(/\s+/g, '-')).trim();

  const exists = await query('SELECT id FROM Categories WHERE name = @name OR slug = @slug', { name, slug });
  if (exists.length) {
    return res.status(400).json({ message: 'Category already exists.' });
  }

  const id = crypto.randomUUID();
  await execute('INSERT INTO Categories (id, name, slug) VALUES (@id, @name, @slug)', {
    id,
    name,
    slug,
  });
  res.status(201).json({ id, name, slug });
});

categoriesRouter.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const id = req.params.id;
  const name = String(req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  const slug = String(req.body.slug || name.toLowerCase().replace(/\s+/g, '-')).trim();

  await execute(
    'UPDATE Categories SET name = @name, slug = @slug WHERE id = @id',
    { id, name, slug },
  );

  const [updated] = await query('SELECT id, name, slug FROM Categories WHERE id = @id', { id });
  if (!updated) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  res.json(updated);
});

categoriesRouter.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const [dependent] = await query('SELECT TOP 1 id FROM Products WHERE categoryId = @id', {
    id: req.params.id,
  });
  if (dependent) {
    return res
      .status(400)
      .json({ message: 'Неможливо видалити категорію з товарами. Спочатку видаліть або перемістіть товари.' });
  }

  await execute('DELETE FROM Categories WHERE id = @id', { id: req.params.id });
  res.status(204).send();
});
