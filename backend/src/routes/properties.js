import { Router } from 'express';
import Property from '../models/Property.js';

const router = Router();

router.get('/', async (req, res) => {
  const list = await Property.find().sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const item = await Property.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  try {
    const created = await Property.create(req.body);
    res.json(created);
  } catch (e) {
    res.status(400).json({ message: 'Create failed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: 'Update failed' });
  }
});

export default router;


