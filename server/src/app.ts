import cors from 'cors';
import express from 'express';
import { query } from './db';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth';
import { categoriesRouter } from './routes/categories';
import { ordersRouter } from './routes/orders';
import { productsRouter } from './routes/products';
import { settingsRouter } from './routes/settings';
import { usersRouter } from './routes/users';

export const app = express();

const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === frontendOrigin) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({ message: 'ShvydkoFood API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    logger.error('Health check failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ status: 'error', database: 'disconnected', message: errorMessage });
  }
});

app.get('/api/db-test', async (_req, res) => {
  try {
    const result = await query<{ ok: number }>('SELECT 1 AS ok');
    res.json({ ok: result[0]?.ok ?? 1 });
  } catch (error) {
    logger.error('DB test error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      detail: errorMessage 
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});
