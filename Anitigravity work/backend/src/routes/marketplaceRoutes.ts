import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { MarketplaceItem } from '../models/MarketplaceItem';

const router = Router();

// 1. Get All Available Items
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await MarketplaceItem.find({ status: 'available' }).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 2. Post New Trading Listing
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, price, category, contactInfo, imageUrl } = req.body;

    if (!title || !description || price === undefined || !contactInfo) {
      return res.status(400).json({ message: 'Title, description, price, and contact info are required.' });
    }

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category: category || 'books',
      sellerId: req.user?.id,
      contactInfo,
      imageUrl: imageUrl || ''
    });

    await newItem.save();
    return res.status(201).json(newItem);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 3. Mark Item as Sold / Update Details
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, title, description, price } = req.body;

    const item = await MarketplaceItem.findOne({ _id: req.params.id, sellerId: req.user?.id });
    if (!item) {
      return res.status(404).json({ message: 'Item listing not found or unauthorized.' });
    }

    if (status) item.status = status;
    if (title) item.title = title;
    if (description) item.description = description;
    if (price !== undefined) item.price = price;

    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

export default router;
