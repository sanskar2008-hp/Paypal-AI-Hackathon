import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAgenticCartProposals, sanitizeQuantity } from './cartRules';
import { Product } from '../types';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'UltraBook Pro 14',
  description: 'Fast lightweight laptop',
  category: 'Electronics',
  price: 899.99,
  currency: 'USD',
  imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  inStock: true,
  stockQuantity: 10,
  rating: 4.8,
  reviewCount: 34,
  attributes: { brand: 'NovaTech', ram: '16GB' },
  isDemoProduct: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProductOutOfStock: Product = {
  id: 'prod-out',
  name: 'Rare Ergonomic Chair',
  description: 'Sold out chair',
  category: 'Home Office',
  price: 299.99,
  currency: 'USD',
  imageUrl: 'https://images.unsplash.com/photo-1580481077114-1e089201550d?auto=format&fit=crop&w=600&q=80',
  inStock: false,
  stockQuantity: 0,
  rating: 4.5,
  reviewCount: 12,
  attributes: { brand: 'ErgoComfort' },
  isDemoProduct: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

test('applyAgenticCartProposals refuses to alter cart without customer confirmation', () => {
  const result = applyAgenticCartProposals(
    [],
    [{ productId: 'prod-1', quantity: 1, reason: 'Great college laptop' }],
    [mockProductA],
    false // no explicit customer confirmation
  );

  assert.equal(result.requiresApproval, true);
  assert.equal(result.updatedCart.length, 0);
  assert.equal(result.appliedItems.length, 0);
  assert.equal(result.rejectedItems.length, 1);
});

test('applyAgenticCartProposals applies valid items when confirmed', () => {
  const result = applyAgenticCartProposals(
    [],
    [{ productId: 'prod-1', quantity: 2, reason: 'Matched budget' }],
    [mockProductA],
    true // customer confirmed
  );

  assert.equal(result.requiresApproval, false);
  assert.equal(result.updatedCart.length, 1);
  assert.equal(result.updatedCart[0].productId, 'prod-1');
  assert.equal(result.updatedCart[0].quantity, 2);
  assert.equal(result.appliedItems.length, 1);
});

test('applyAgenticCartProposals rejects out of stock or nonexistent products', () => {
  const result = applyAgenticCartProposals(
    [],
    [
      { productId: 'prod-out', quantity: 1, reason: 'Ergonomic seat' },
      { productId: 'prod-nonexistent', quantity: 1, reason: 'Fake item' },
    ],
    [mockProductA, mockProductOutOfStock],
    true
  );

  assert.equal(result.updatedCart.length, 0);
  assert.equal(result.rejectedItems.length, 2);
});

test('sanitizeQuantity enforces minimum of 1 and maximum stock', () => {
  assert.equal(sanitizeQuantity(-5, 10), 1);
  assert.equal(sanitizeQuantity(0, 10), 1);
  assert.equal(sanitizeQuantity(3, 10), 3);
  assert.equal(sanitizeQuantity(25, 10), 10);
});
