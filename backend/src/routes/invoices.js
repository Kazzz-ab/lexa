import { Router } from 'express';
import Invoice from '../models/Invoice.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status, client, attorney, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (client) filter.client = client;
    if (attorney) filter.attorney = attorney;
    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('client', 'firstName lastName company')
        .populate({ path: 'attorney', populate: { path: 'user', select: 'name' } })
        .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      Invoice.countDocuments(filter),
    ]);
    res.json({ invoices, total });
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin', 'paralegal'), async (req, res, next) => {
  try {
    const count = await Invoice.countDocuments();
    req.body.invoiceNumber = `INV-CL-${String(count + 1).padStart(5, '0')}`;
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin', 'paralegal'), async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { next(err); }
});

export default router;
