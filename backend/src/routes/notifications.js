import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 86400000);

    const [urgentCases, overdue, upcomingCourt] = await Promise.all([
      prisma.case.findMany({
        where: { priority: 'urgent', status: { in: ['open', 'active', 'pending'] } },
        include: { client: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: { status: 'overdue' },
        include: { client: { select: { firstName: true, lastName: true } } },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
      prisma.case.findMany({
        where: { courtDate: { gte: now, lte: sevenDays } },
        include: { client: { select: { firstName: true, lastName: true } } },
        orderBy: { courtDate: 'asc' },
        take: 5,
      }),
    ]);

    const notifications = [
      ...urgentCases.map(c => ({
        id: `case-urgent-${c.id}`,
        type: 'urgent',
        title: `Urgent: ${c.title}`,
        body: `${c.client.firstName} ${c.client.lastName} — ${c.caseNumber}`,
        time: c.createdAt,
        href: '/cases',
      })),
      ...upcomingCourt.map(c => ({
        id: `court-${c.id}`,
        type: 'court',
        title: `Court date: ${c.title}`,
        body: `${new Date(c.courtDate).toLocaleDateString()} — ${c.client.firstName} ${c.client.lastName}`,
        time: c.courtDate,
        href: '/cases',
      })),
      ...overdue.map(i => ({
        id: `inv-${i.id}`,
        type: 'invoice',
        title: `Overdue: ${i.invoiceNumber}`,
        body: `${i.client.firstName} ${i.client.lastName} — $${i.total}`,
        time: i.dueDate,
        href: '/invoices',
      })),
    ];

    res.json({ notifications, count: notifications.length });
  } catch (err) { next(err); }
});

export default router;
