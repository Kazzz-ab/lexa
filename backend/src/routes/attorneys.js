import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

const attInclude = { user: { select: { id: true, name: true, email: true } } };

function shapeAttorney(a) {
  const att = withId(a);
  if (att.user) att.user._id = att.user.id;
  return att;
}

router.get('/', async (req, res, next) => {
  try {
    const attorneys = await prisma.attorney.findMany({ where: { isActive: true }, include: attInclude });
    res.json(attorneys.map(shapeAttorney));
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { userId, barNumber, practiceAreas, hourlyRate, bio } = req.body;
    const attorney = await prisma.attorney.create({
      data: { userId, barNumber, practiceAreas: practiceAreas || [], hourlyRate: Number(hourlyRate) || 0, bio },
      include: attInclude,
    });
    res.status(201).json(shapeAttorney(attorney));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const attorney = await prisma.attorney.findUnique({ where: { id: req.params.id }, include: attInclude });
    if (!attorney) return res.status(404).json({ message: 'Attorney not found' });
    res.json(shapeAttorney(attorney));
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { barNumber, practiceAreas, hourlyRate, bio } = req.body;
    const attorney = await prisma.attorney.update({
      where: { id: req.params.id },
      data: { barNumber, practiceAreas: practiceAreas || [], hourlyRate: Number(hourlyRate) || 0, bio },
      include: attInclude,
    });
    res.json(shapeAttorney(attorney));
  } catch (err) { next(err); }
});

router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await prisma.attorney.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
