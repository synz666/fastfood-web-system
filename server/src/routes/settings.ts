import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { execute, query } from '../db';

export const settingsRouter = Router();

settingsRouter.get('/', async (_req, res) => {
  const settings = await query('SELECT TOP 1 * FROM Settings ORDER BY createdAt DESC');
  if (!settings.length) {
    return res.json({
      siteName: 'ШвидкоFood',
      siteDescription: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
    });
  }
  const item = settings[0];
  return res.json({
    siteName: item.siteName,
    siteDescription: item.siteDescription,
    address: item.address,
    phone: item.phone,
    email: item.email,
    workingHours: item.workingHours,
  });
});

settingsRouter.put('/', authenticateToken, requireAdmin, async (req, res) => {
  const payload = req.body;
  const settings = await query('SELECT TOP 1 id FROM Settings');
  if (settings.length) {
    const id = settings[0].id;
    await execute(
      `UPDATE Settings SET siteName = @siteName, siteDescription = @siteDescription, address = @address, phone = @phone, email = @email, workingHours = @workingHours, updatedAt = SYSUTCDATETIME() WHERE id = @id`,
      {
        id,
        siteName: String(payload.siteName || ''),
        siteDescription: String(payload.siteDescription || ''),
        address: String(payload.address || ''),
        phone: String(payload.phone || ''),
        email: String(payload.email || ''),
        workingHours: String(payload.workingHours || ''),
      },
    );
    return res.json({ message: 'Settings updated' });
  }

  const id = crypto.randomUUID();
  await execute(
    `INSERT INTO Settings (id, siteName, siteDescription, address, phone, email, workingHours, createdAt, updatedAt)
     VALUES (@id, @siteName, @siteDescription, @address, @phone, @email, @workingHours, SYSUTCDATETIME(), SYSUTCDATETIME())`,
    {
      id,
      siteName: String(payload.siteName || ''),
      siteDescription: String(payload.siteDescription || ''),
      address: String(payload.address || ''),
      phone: String(payload.phone || ''),
      email: String(payload.email || ''),
      workingHours: String(payload.workingHours || ''),
    },
  );
  res.json({ message: 'Settings saved' });
});
