import { Router } from 'express';
import Case from '../models/Case.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status, attorney, client, practiceArea, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (attorney) filter.$or = [{ leadAttorney: attorney }, { attorneys: attorney }];
    if (client) filter.client = client;
    if (practiceArea) filter.practiceArea = new RegExp(practiceArea, 'i');
    const [cases, total] = await Promise.all([
      Case.find(filter)
        .populate('client', 'firstName lastName company')
        .populate({ path: 'leadAttorney', populate: { path: 'user', select: 'name' } })
        .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      Case.countDocuments(filter),
    ]);
    res.json({ cases, total });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const count = await Case.countDocuments();
    req.body.caseNumber = `CF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const newCase = await Case.create(req.body);
    res.status(201).json(newCase);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const c = await Case.findById(req.params.id)
      .populate('client')
      .populate({ path: 'leadAttorney', populate: { path: 'user', select: 'name' } })
      .populate({ path: 'attorneys', populate: { path: 'user', select: 'name' } });
    if (!c) return res.status(404).json({ message: 'Case not found' });
    res.json(c);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const c = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!c) return res.status(404).json({ message: 'Case not found' });
    res.json(c);
  } catch (err) { next(err); }
});

export default router;
