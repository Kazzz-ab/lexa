import { Router } from 'express';
import Attorney from '../models/Attorney.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const attorneys = await Attorney.find({ isActive: true }).populate('user', 'name email');
    res.json(attorneys);
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const attorney = await Attorney.create(req.body);
    res.status(201).json(attorney);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const attorney = await Attorney.findById(req.params.id).populate('user', 'name email');
    if (!attorney) return res.status(404).json({ message: 'Attorney not found' });
    res.json(attorney);
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const attorney = await Attorney.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!attorney) return res.status(404).json({ message: 'Attorney not found' });
    res.json(attorney);
  } catch (err) { next(err); }
});

export default router;
