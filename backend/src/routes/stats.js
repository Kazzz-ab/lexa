import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      activeClients,
      totalAttorneys,
      caseRecords,
      overdueInvoices,
      paidMTD,
      pendingBillable,
    ] = await Promise.all([
      prisma.client.count({ where: { isActive: true } }),
      prisma.attorney.count({ where: { isActive: true } }),
      prisma.case.findMany({ select: { status: true } }),
      prisma.invoice.count({ where: { status: 'overdue' } }),
      prisma.invoice.aggregate({ where: { status: 'paid', paidAt: { gte: monthStart } }, _sum: { total: true } }),
      prisma.invoice.aggregate({ where: { status: { in: ['sent', 'draft'] } }, _sum: { total: true } }),
    ]);

    const caseBreakdown = {};
    caseRecords.forEach(c => { caseBreakdown[c.status] = (caseBreakdown[c.status] || 0) + 1; });
    const openCases = (caseBreakdown.open || 0) + (caseBreakdown.active || 0) + (caseBreakdown.pending || 0);

    res.json({
      activeClients,
      totalAttorneys,
      openCases,
      caseBreakdown,
      overdueInvoices,
      paidMTD: paidMTD._sum.total || 0,
      pendingBillable: pendingBillable._sum.total || 0,
    });
  } catch (err) { next(err); }
});

export default router;
