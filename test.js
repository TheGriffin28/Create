const assert = require('assert');
const { ProductStore } = require('./server.js');

console.log('⚡ Running Create Test Suite...');
const store = new ProductStore();
store.items.clear();
store.nextId = 1;

assert.throws(() => store.create({ sku: '', name: 'Test' }), /Valid SKU is required/);
const p1 = store.create({ sku: 'SKU-001', name: 'Keyboard', category: 'Hardware', quantity: 20, minThreshold: 5, unitPrice: 50 });
assert.strictEqual(p1.id, 1);
assert.strictEqual(p1.status, 'In Stock');

const p2 = store.create({ sku: 'SKU-002', name: 'Cable', category: 'Accessories', quantity: 3, minThreshold: 5, unitPrice: 10 });
assert.strictEqual(p2.status, 'Low Stock');

const stats = store.stats();
assert.strictEqual(stats.totalProducts, 2);
assert.strictEqual(stats.totalInventoryValue, 1030);

console.log('✓ All Create automated test assertions passed cleanly with exit code 0.');
