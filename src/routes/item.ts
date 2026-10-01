import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Basic manual validation — swap for zod if this grows past a couple of fields.
function validateItemInput(body: any, { partial = false } = {}) {
  const errors: string[] = [];

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push('"name" is required and must be a non-empty string');
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== 'number' || Number.isNaN(body.price) || body.price < 0) {
      errors.push('"price" is required and must be a non-negative number');
    }
  }

  if (!partial || body.quantity !== undefined) {
    if (!Number.isInteger(body.quantity) || body.quantity < 0) {
      errors.push('"quantity" is required and must be a non-negative integer');
    }
  }

  return errors;
}

function parseId(req: Request): number | null {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /items — list all
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ items });
  } catch (error) {
    console.error('GET /items failed:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /items/:id — fetch one
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseId(req);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  try {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ item });
  } catch (error) {
    console.error('GET /items/:id failed:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /items — create
router.post('/', async (req: Request, res: Response) => {
  const errors = validateItemInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { name, price, quantity } = req.body;

  try {
    const item = await prisma.item.create({
      data: { name: name.trim(), price, quantity },
    });
    res.status(201).json({ item });
  } catch (error) {
    console.error('POST /items failed:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /items/:id — partial update
router.put('/:id', async (req: Request, res: Response) => {
  const id = parseId(req);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  const errors = validateItemInput(req.body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Provide at least one field to update' });
  }

  const { name, price, quantity } = req.body;
  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name.trim();
  if (price !== undefined) data.price = price;
  if (quantity !== undefined) data.quantity = quantity;

  try {
    const item = await prisma.item.update({ where: { id }, data });
    res.json({ item });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      // Prisma's "record to update not found" error
      return res.status(404).json({ error: 'Item not found' });
    }
    console.error('PUT /items/:id failed:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /items/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseId(req);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  try {
    await prisma.item.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    console.error('DELETE /items/:id failed:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;