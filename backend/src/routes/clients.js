import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const safeLimit = Math.min(Number(limit), 200);
    if (search && search.length > 100) return res.status(400).json({ message: 'Search query too long' });
    const where = { isActive: true };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = Math.max(0, (Number(page) - 1) * safeLimit);
    const [clients, total] = await Promise.all([
      prisma.client.findMany({ where, skip, take: safeLimit, orderBy: { createdAt: 'desc' } }),
      prisma.client.count({ where }),
    ]);
    res.json({ clients: withId(clients), total, page: Number(page) });
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin', 'paralegal', 'attorney'), async (req, res, next) => {
  try {
    if (!req.body.firstName || !req.body.lastName) return res.status(400).json({ message: 'First and last name are required' });
    const { firstName, lastName, email, phone, company, clientType, referredBy, notes } = req.body;
    const client = await prisma.client.create({ data: { firstName, lastName, email, phone, company, clientType: clientType || 'individual', referredBy, notes } });
    res.status(201).json(withId(client));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(withId(client));
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin', 'paralegal', 'attorney'), async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, company, clientType, referredBy, notes } = req.body;
    const client = await prisma.client.update({ where: { id: req.params.id }, data: { firstName, lastName, email, phone, company, clientType, referredBy, notes } });
    res.json(withId(client));
  } catch (err) { next(err); }
});

router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await prisma.client.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
