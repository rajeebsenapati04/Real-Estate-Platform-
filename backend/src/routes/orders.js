import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const created = await Order.create(req.body);
    res.json(created);
  } catch (e) {
    res.status(400).json({ message: 'Create failed' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const list = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(list);
});

export default router;


