import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { execute, query } from '../db';
import { createToken } from '../middleware/auth';

export const authRouter = Router();

interface RegisterBody {
  login: string;
  email: string;
  password: string;
}

authRouter.post('/register', async (req, res) => {
  const { login, email, password } = req.body as RegisterBody;
  const normalizedLogin = String(login || '').trim().toLowerCase();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (normalizedLogin.length < 3) {
    return res.status(400).json({ message: 'Логін має містити щонайменше 3 символи.' });
  }
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return res.status(400).json({ message: 'Введіть коректну email-адресу.' });
  }
  if (typeof password !== 'string' || password.length < 4) {
    return res.status(400).json({ message: 'Пароль має містити щонайменше 4 символи.' });
  }
  if (normalizedLogin === 'admin') {
    return res.status(400).json({ message: 'Цей логін зарезервований для адміністратора.' });
  }

  const existingUsers = await query('SELECT id FROM Users WHERE username = @login OR email = @email', {
    login: normalizedLogin,
    email: normalizedEmail,
  });
  if (existingUsers.length > 0) {
    return res.status(400).json({ message: 'Користувач з таким логіном або email уже існує.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();
  await execute(
    'INSERT INTO Users (id, username, email, passwordHash, role, createdAt) VALUES (@id, @login, @email, @passwordHash, @role, SYSUTCDATETIME())',
    {
      id: userId,
      login: normalizedLogin,
      email: normalizedEmail,
      passwordHash,
      role: 'user',
    },
  );

  const token = createToken({ userId, login: normalizedLogin, email: normalizedEmail, role: 'user' });
  return res.status(201).json({ userId, login: normalizedLogin, email: normalizedEmail, role: 'user', token });
});

authRouter.post('/login', async (req, res) => {
  const { identifier, password } = req.body as { identifier: string; password: string };
  const normalized = String(identifier || '').trim().toLowerCase();
  const users = await query('SELECT id, username, email, passwordHash, role FROM Users WHERE username = @identifier OR email = @identifier', {
    identifier: normalized,
  });
  const user = users[0];
  if (!user) {
    return res.status(400).json({ message: 'Невірний логін або пароль.' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: 'Невірний логін або пароль.' });
  }

  const token = createToken({ userId: user.id, login: user.username, email: user.email, role: user.role });
  return res.json({ userId: user.id, login: user.username, email: user.email, role: user.role, token });
});

authRouter.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_me_later') as {
      userId: string;
      login: string;
      email: string;
      role: string;
    };
    const user = await query('SELECT id, username, email, role FROM Users WHERE id = @id', { id: payload.userId });
    if (!user.length) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const currentUser = user[0];
    return res.json({ userId: currentUser.id, login: currentUser.username, email: currentUser.email, role: currentUser.role, token });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});
