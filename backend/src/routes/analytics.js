import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();

    // Cases opened per month (last 6 months)
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return d;
    });

    const casesOpened = await Promise.all(months.map(async (start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
      const count = await prisma.case.count({ where: { createdAt: { gte: start, lte: end } } });
      return {
        month: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        cases: count,
      };
    }));

    // Monthly billing (last 6 months)
    const billing = await Promise.all(months.map(async (start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
      const result = await prisma.invoice.aggregate({
        where: { status: 'paid', paidAt: { gte: start, lte: end } },
        _sum: { total: true },
      });
      return {
        month: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: Math.round(result._sum.total || 0),
      };
    }));

    // Case status breakdown
    const statuses = await prisma.case.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const statusData = statuses.map(s => ({ name: s.status, value: s._count.id }));

    // Practice area breakdown
    const areas = await prisma.case.groupBy({
      by: ['practiceArea'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });
    const areaData = areas.map(a => ({ name: a.practiceArea, value: a._count.id }));

    res.json({ casesOpened, billing, statusData, areaData });
  } catch (err) { next(err); }
});

export default router;
