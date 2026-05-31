import { Router } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { execute, pool, poolConnect, query } from '../db';
import { sql } from '../database';
import { ensureArray, safeJsonParse, isGuid } from '../utils/normalize';
import { logger } from '../utils/logger';

export const ordersRouter = Router();

// use helpers from ../utils/normalize

function normalizeOrderItem(item: any) {
  const size = safeJsonParse<any>(item.selectedSize);
  return {
    id: item.id,
    productId: item.productId,
    title: String(item.productTitle ?? item.title ?? 'Товар'),
    quantity: Number(item.quantity || 0),
    itemPrice: Number(item.price || 0),
    size: size ?? undefined,
    addons: ensureArray(item.addons),
  };
}

function parseOrder(item: any) {
  return {
    id: item.id || item.orderId,
    number: item.number,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    total: Number(item.totalPrice),
    status: item.status,
    customer: {
      fullName: item.customerName,
      phone: item.phone,
      email: item.email,
      address: item.address,
      comment: item.comment,
      paymentMethod: item.paymentMethod,
      deliveryMethod: item.deliveryMethod,
    },
    items: ensureArray<any>(item.items).map(normalizeOrderItem),
  };
}

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

ordersRouter.get('/', authenticateToken, async (req: AuthRequest, res) => {
  const isAdmin = req.user?.role === 'admin';
  const orders = isAdmin
    ? await query(
        `SELECT o.*, (
          SELECT o2.id, o2.productId, o2.quantity, o2.price, o2.selectedSize, o2.addons, p.name AS productTitle
          FROM OrderItems o2
          LEFT JOIN Products p ON p.id = o2.productId
          WHERE o2.orderId = o.id
          FOR JSON PATH
        ) AS items
         FROM Orders o
         ORDER BY o.createdAt DESC`,
      )
    : await query(
        `SELECT o.*, (
          SELECT o2.id, o2.productId, o2.quantity, o2.price, o2.selectedSize, o2.addons, p.name AS productTitle
          FROM OrderItems o2
          LEFT JOIN Products p ON p.id = o2.productId
          WHERE o2.orderId = o.id
          FOR JSON PATH
        ) AS items
         FROM Orders o
         WHERE o.userId = @userId
         ORDER BY o.createdAt DESC`,
        { userId: req.user?.userId },
      );

  return res.json(orders.map(parseOrder));
});

ordersRouter.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const orderId = String(req.params.id || '').trim();
  if (!guidRegex.test(orderId)) {
    return res.status(400).json({ message: 'Invalid order id' });
  }

  const [order] = await query(
    `SELECT o.*, (
      SELECT o2.id, o2.productId, o2.quantity, o2.price, o2.selectedSize, o2.addons, p.name AS productTitle
      FROM OrderItems o2
      LEFT JOIN Products p ON p.id = o2.productId
      WHERE o2.orderId = o.id
      FOR JSON PATH
    ) AS items
     FROM Orders o
     WHERE o.id = @id`,
    { id: orderId },
  );
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (req.user?.role !== 'admin' && order.userId !== req.user?.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return res.json(parseOrder(order));
});

ordersRouter.post('/', async (req: AuthRequest, res) => {
  const payload = req.body;
  const userId = req.user?.userId || null;
  const orderId = crypto.randomUUID();
  const number = Math.floor(100000 + Math.random() * 900000).toString();
  const status = 'Нове';

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) {
    return res.status(400).json({ message: 'Замовлення має містити хоча б один товар.' });
  }

  const totalPrice = parseFloat(String(payload.total || 0));

  for (const item of items) {
    const productId = String(item.productId || '').trim();
    if (!isGuid(productId)) {
      return res.status(400).json({ message: 'Некоректний ID товару в замовленні' });
    }
  }

  await execute(
    `INSERT INTO Orders (id, userId, customerName, email, phone, totalPrice, status, address, comment, paymentMethod, deliveryMethod, createdAt, updatedAt)
     VALUES (@id, @userId, @customerName, @email, @phone, @totalPrice, @status, @address, @comment, @paymentMethod, @deliveryMethod, SYSUTCDATETIME(), SYSUTCDATETIME())`,
    {
      id: orderId,
      userId,
      customerName: String(payload.customer.fullName || ''),
      email: String(payload.customer.email || ''),
      phone: String(payload.customer.phone || ''),
      totalPrice,
      status,
      address: String(payload.customer.address || ''),
      comment: String(payload.customer.comment || ''),
      paymentMethod: String(payload.customer.paymentMethod || ''),
      deliveryMethod: String(payload.customer.deliveryMethod || ''),
    },
  );

  for (const item of items) {
    const itemId = crypto.randomUUID();
    await execute(
      `INSERT INTO OrderItems (id, orderId, productId, quantity, price, selectedSize, addons)
       VALUES (@id, @orderId, @productId, @quantity, @price, @selectedSize, @addons)`,
      {
        id: itemId,
        orderId,
        productId: String(item.productId),
        quantity: Number(item.quantity || 0),
        price: Number(item.itemPrice || 0),
        selectedSize: JSON.stringify(item.size ?? null),
        addons: JSON.stringify(Array.isArray(item.addons) ? item.addons : []),
      },
    );
  }

  const [created] = await query(
    `SELECT o.*, (
      SELECT o2.id, o2.productId, o2.quantity, o2.price, o2.selectedSize, o2.addons, p.name AS productTitle
      FROM OrderItems o2
      LEFT JOIN Products p ON p.id = o2.productId
      WHERE o2.orderId = o.id
      FOR JSON PATH
    ) AS items
     FROM Orders o
     WHERE o.id = @id`,
    { id: orderId },
  );

  return res.status(201).json(parseOrder(created));
});

ordersRouter.put('/:id/status', authenticateToken, requireAdmin, async (_req, res) => {
  const orderId = String(_req.params.id || '').trim();
  if (!guidRegex.test(orderId)) {
    return res.status(400).json({ message: 'Invalid order id' });
  }

  const status = String(_req.body.status || '').trim();
  await execute('UPDATE Orders SET status = @status, updatedAt = SYSUTCDATETIME() WHERE id = @id', {
    id: orderId,
    status,
  });
  const [updated] = await query('SELECT id FROM Orders WHERE id = @id', { id: orderId });
  if (!updated) {
    return res.status(404).json({ message: 'Order not found' });
  }
  return res.json({ id: orderId, status });
});

ordersRouter.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const orderId = String(req.params.id || '').trim();
  if (!guidRegex.test(orderId)) {
    return res.status(400).json({ message: 'Invalid order id' });
  }

  const [existing] = await query('SELECT id FROM Orders WHERE id = @id', { id: orderId });
  if (!existing) {
    return res.status(404).json({ message: 'Order not found' });
  }

  try {
    await poolConnect;
    let transaction: sql.Transaction | null = null;
    try {
      transaction = pool.transaction();
      await transaction.begin();
      const request = transaction.request();
      request.input('id', sql.UniqueIdentifier, orderId);
      await request.query('DELETE FROM OrderItems WHERE orderId = @id');
      await request.query('DELETE FROM Orders WHERE id = @id');
      await transaction.commit();
    } catch (innerError) {
      if (transaction) {
        try {
          await transaction.rollback();
        } catch (rollbackError) {
          logger.error('Failed to rollback order delete transaction:', rollbackError);
        }
      }
      throw innerError;
    }
    return res.json({ message: 'Замовлення видалено' });
  } catch (error) {
    logger.error('Failed to delete order:', error);
    return res.status(500).json({ message: 'Не вдалося видалити замовлення' });
  }
});
