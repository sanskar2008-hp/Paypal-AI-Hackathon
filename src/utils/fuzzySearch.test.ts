import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  levenshteinDistance, 
  fuzzySubsequenceScore, 
  tokenFuzzyScore, 
  fuzzySearchProducts 
} from './fuzzySearch';
import { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'AeroBook Pro 14" M3',
    description: 'Ultra-thin powerhouse featuring 16GB unified memory, 512GB NVMe SSD, and 18-hour battery.',
    category: 'Electronics',
    price: 849.00,
    currency: 'USD',
    imageUrl: '',
    inStock: true,
    stockQuantity: 12,
    rating: 4.8,
    reviewCount: 42,
    attributes: { brand: 'AeroTech', ram: '16GB', storage: '512GB' },
    isDemoProduct: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'prod-2',
    name: 'AuraSound Pro ANC Wireless Headphones',
    description: 'Flagship hybrid active noise cancelling over-ear headphones with custom 40mm bio-cellulose drivers.',
    category: 'Audio & Wearables',
    price: 199.00,
    currency: 'USD',
    imageUrl: '',
    inStock: true,
    stockQuantity: 35,
    rating: 4.9,
    reviewCount: 88,
    attributes: { brand: 'AuraSound', ancLevel: '42dB', connectivity: 'Bluetooth 5.3' },
    isDemoProduct: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'prod-3',
    name: 'ErgoLift Pro Dual-Motor Standing Desk',
    description: 'Solid walnut finish desktop with whisper-quiet dual motors and 4 memory presets.',
    category: 'Home Office',
    price: 499.00,
    currency: 'USD',
    imageUrl: '',
    inStock: true,
    stockQuantity: 9,
    rating: 4.8,
    reviewCount: 37,
    attributes: { brand: 'ErgoWorks', dimensions: '60 x 30 in' },
    isDemoProduct: true,
    createdAt: '',
    updatedAt: '',
  },
];

test('levenshteinDistance computes transposition and character edits accurately', () => {
  assert.equal(levenshteinDistance('laptop', 'laptop'), 0);
  assert.equal(levenshteinDistance('aerobook', 'aerobok'), 1); // 1 deletion
  assert.equal(levenshteinDistance('teh', 'the'), 1); // 1 transposition
  assert.equal(levenshteinDistance('wreless', 'wireless'), 1); // 1 insertion
});

test('fuzzySubsequenceScore gives high score for prefix and full containment', () => {
  const exact = fuzzySubsequenceScore('AeroBook', 'AeroBook');
  assert.equal(exact, 100);

  const prefix = fuzzySubsequenceScore('AeroBook Pro', 'aero');
  assert.ok(prefix >= 85);

  const subseq = fuzzySubsequenceScore('Headphones', 'hdphn');
  assert.ok(subseq > 0);
});

test('fuzzySearchProducts handles typo tolerance (e.g. aerobok -> AeroBook)', () => {
  const results = fuzzySearchProducts(mockProducts, 'aerobok');
  assert.ok(results.length >= 1);
  assert.equal(results[0].id, 'prod-1');
});

test('fuzzySearchProducts handles multi-term search and ranks closest match first', () => {
  const results = fuzzySearchProducts(mockProducts, 'wireless noise headphones');
  assert.ok(results.length >= 1);
  assert.equal(results[0].id, 'prod-2'); // AuraSound Pro ANC Wireless Headphones
});

test('fuzzySearchProducts handles brand and category fuzzy matching', () => {
  const deskResults = fuzzySearchProducts(mockProducts, 'ergowork');
  assert.ok(deskResults.length >= 1);
  assert.equal(deskResults[0].id, 'prod-3');
});

test('fuzzySearchProducts returns all items when query is empty', () => {
  const all = fuzzySearchProducts(mockProducts, '');
  assert.equal(all.length, mockProducts.length);
});
