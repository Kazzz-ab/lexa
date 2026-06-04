import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

const caseInclude = {
  client: { select: { id: true, firstName: true, lastName: true, company: true } },
  leadAttorney: { include: { user: { select: { id: true, name: true } } } },
};

router.get('/', async (req, res, next) => {
  try {
    const { status, attorney, client, practiceArea, page = 1, limit = 20 } = req.query;
    const safeLimit = Math.min(Number(limit), 200);
    const where = {};
    if (status) where.status = status;
    if (attorney) where.leadAttorneyId = attorney;
    if (client) where.clientId = client;
    if (practiceArea) where.practiceArea = { contains: practiceArea, mode: 'insensitive' };
    const skip = Math.max(0, (Number(page) - 1) * safeLimit);
    const [cases, total] = await Promise.all([
      prisma.case.findMany({ where, skip, take: safeLimit, include: caseInclude, orderBy: { createdAt: 'desc' } }),
      prisma.case.count({ where }),
    ]);
    res.json({ cases: withId(cases), total });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, client, leadAttorney, practiceArea, caseType, description, notes } = req.body;
    const year = new Date().getFullYear();
    const count = await prisma.case.count({ where: { caseNumber: { startsWith: `CF-${year}-` } } });
    const caseNumber = `CF-${year}-${String(count + 1).padStart(4, '0')}`;
    const newCase = await prisma.case.create({
      data: { caseNumber, title, clientId: client, leadAttorneyId: leadAttorney, practiceArea, caseType: caseType || 'other', description, notes },
      include: caseInclude,
    });
    res.status(201).json(withId(newCase));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const c = await prisma.case.findUnique({ where: { id: req.params.id }, include: caseInclude });
    if (!c) return res.status(404).json({ message: 'Case not found' });
    res.json(withId(c));
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, leadAttorney, practiceArea, caseType, status, priority, closedAt, courtDate, description, notes } = req.body;
    const c = await prisma.case.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(leadAttorney && { leadAttorneyId: leadAttorney }),
        ...(practiceArea && { practiceArea }),
        ...(caseType && { caseType }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(closedAt !== undefined && { closedAt: closedAt ? new Date(closedAt) : null }),
        ...(courtDate !== undefined && { courtDate: courtDate ? new Date(courtDate) : null }),
        ...(description !== undefined && { description }),
        ...(notes !== undefined && { notes }),
        ...(status === 'closed' && { closedAt: new Date() }),
      },
      include: caseInclude,
    });
    res.json(withId(c));
  } catch (err) { next(err); }
});

export default router;
