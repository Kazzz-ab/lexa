import { Router } from 'express';
import Client from '../models/Client.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = search
      ? { $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }, { company: new RegExp(search, 'i') }] }
      : {};
    const [clients, total] = await Promise.all([
      Client.find(filter).skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      Client.countDocuments(filter),
    ]);
    res.json({ clients, total, page: Number(page) });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Client.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
