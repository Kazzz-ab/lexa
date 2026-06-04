import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma, { withId } from '../lib/prisma.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect, requireRole('admin'));

const ROLES = ['admin', 'attorney', 'paralegal'];

router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(withId(users));
  } catch (err) { next(err); }
});

router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (!ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
    res.status(201).json(withId({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }));
  } catch (err) { next(err); }
});

router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (req.params.id === req.user.id) return res.status(400).json({ message: 'Cannot change your own role' });
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(withId(user));
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: 'Cannot delete your own account' });
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) { next(err); }
});

router.get('/audit', async (req, res, next) => {
  try {
    const { page = 1, limit = 50, resource, action } = req.query;
    const safeLimit = Math.min(Number(limit), 200);
    const where = {};
    if (resource) where.resource = resource;
    if (action) where.action = action;
    const skip = Math.max(0, (Number(page) - 1) * safeLimit);
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take: safeLimit, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count({ where }),
    ]);
    res.json({ logs, total });
  } catch (err) { next(err); }
});

export default router;
