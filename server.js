// ==============================================================================
// Create — Production Inventory REST API Server
// ==============================================================================
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

class ProductStore {
  constructor() {
    this.items = new Map();
    this.nextId = 1;
    this.seed();
  }

  seed() {
    this.create({ sku: 'PRD-101', name: 'Wireless Ergonomic Mouse', category: 'Hardware', quantity: 45, minThreshold: 10, unitPrice: 29.99 });
    this.create({ sku: 'PRD-102', name: 'Mechanical Keyboard (RGB)', category: 'Hardware', quantity: 3, minThreshold: 5, unitPrice: 89.50 });
    this.create({ sku: 'PRD-103', name: '4K UltraHD Monitor 27"', category: 'Displays', quantity: 12, minThreshold: 4, unitPrice: 349.00 });
  }

  computeStatus(quantity, threshold) {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= threshold) return 'Low Stock';
    return 'In Stock';
  }

  validate(data, isUpdate = false) {
    if (!isUpdate || data.sku !== undefined) {
      if (!data.sku || typeof data.sku !== 'string' || !data.sku.trim()) throw new Error('Valid SKU is required');
    }
    if (!isUpdate || data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) throw new Error('Product name is required');
    }
  }

  create(data) {
    this.validate(data, false);
    const id = this.nextId++;
    const qty = Number(data.quantity || 0);
    const thresh = Number(data.minThreshold || 5);
    const item = {
      id,
      sku: data.sku.trim().toUpperCase(),
      name: data.name.trim(),
      category: data.category || 'General',
      quantity: qty,
      minThreshold: thresh,
      unitPrice: Number(data.unitPrice || 0),
      status: this.computeStatus(qty, thresh),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.set(id, item);
    return item;
  }

  list(query = {}) {
    let list = Array.from(this.items.values());
    if (query.status && query.status !== 'All') list = list.filter(p => p.status.toLowerCase() === query.status.toLowerCase());
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return { items: list, total: list.length };
  }

  get(id) { return this.items.get(Number(id)) || null; }

  update(id, data) {
    const existing = this.get(id);
    if (!existing) return null;
    const qty = data.quantity !== undefined ? Number(data.quantity) : existing.quantity;
    const thresh = data.minThreshold !== undefined ? Number(data.minThreshold) : existing.minThreshold;
    const updated = { ...existing, ...data, quantity: qty, minThreshold: thresh, status: this.computeStatus(qty, thresh), updatedAt: new Date().toISOString() };
    this.items.set(Number(id), updated);
    return updated;
  }

  remove(id) { return this.items.delete(Number(id)); }

  stats() {
    const all = Array.from(this.items.values());
    const totalValue = all.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    return {
      totalProducts: all.length,
      inStock: all.filter(p => p.status === 'In Stock').length,
      lowStock: all.filter(p => p.status === 'Low Stock').length,
      outOfStock: all.filter(p => p.status === 'Out of Stock').length,
      totalInventoryValue: Math.round(totalValue * 100) / 100,
    };
  }
}

const store = new ProductStore();

app.get('/health', (req, res) => res.json({ status: 'healthy', app: 'Create' }));
app.get('/api/stats', (req, res) => res.json(store.stats()));
app.get('/api/products', (req, res) => res.json(store.list(req.query)));
app.get('/api/products/:id', (req, res) => {
  const item = store.get(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/products', (req, res) => {
  try { res.status(201).json(store.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
app.patch('/api/products/:id', (req, res) => {
  try {
    const item = store.update(req.params.id, req.body);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/products/:id', (req, res) => {
  store.remove(req.params.id) ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`🚀 ${'Create'} on port ${PORT}`));
}

module.exports = { app, store, ProductStore };
