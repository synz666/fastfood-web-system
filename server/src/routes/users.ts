import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { query, execute } from '../db';

export const usersRouter = Router();

usersRouter.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await query('SELECT id, username AS login, email, role, createdAt FROM Users ORDER BY createdAt DESC');
  res.json(users);
});

usersRouter.patch('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body as { role?: string };

  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if (req.user?.login !== 'admin') {
    return res.status(403).json({ message: 'Only the main admin can manage roles' });
  }

  const existingUsers = await query('SELECT id, username AS login FROM Users WHERE id = @id', { id });
  if (!existingUsers.length) {
    return res.status(404).json({ message: 'User not found' });
  }

  const targetUser = existingUsers[0];
  if (targetUser.login === 'admin') {
    return res.status(403).json({ message: 'Cannot change the role of the main admin' });
  }

  await execute('UPDATE Users SET role = @role WHERE id = @id', { role, id });
  res.status(204).end();
});

usersRouter.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (req.user?.login !== 'admin') {
    return res.status(403).json({ message: 'Only the main admin can delete users' });
  }

  const existingUsers = await query('SELECT id, username AS login FROM Users WHERE id = @id', { id });
  if (!existingUsers.length) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (existingUsers[0].login === 'admin') {
    return res.status(403).json({ message: 'Cannot delete the main admin' });
  }

  await execute('DELETE FROM Users WHERE id = @id', { id });
  res.status(204).end();
});
