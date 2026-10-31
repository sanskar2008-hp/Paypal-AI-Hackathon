import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  roundToTwoDecimals,
  validatePriceMatch,
  STANDARD_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from './pricing';

test('roundToTwoDecimals formats financial figures cleanly', () => {
  assert.equal(roundToTwoDecimals(19.999), 20.0);
  assert.equal(roundToTwoDecimals(10.123), 10.12);
  assert.equal(roundToTwoDecimals(0), 0);
});

test('calculateCartTotals returns zero values for empty cart', () => {
  const totals = calculateCartTotals([]);
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.tax, 0);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.total, 0);
  assert.equal(totals.itemCount, 0);
  assert.equal(totals.isDemoEstimate, true);
});

test('calculateCartTotals adds flat shipping under threshold', () => {
  const items = [{ price: 45.0, quantity: 1 }];
  const totals = calculateCartTotals(items);

  assert.equal(totals.subtotal, 45.0);
  // 5% of 45 = 2.25
  assert.equal(totals.tax, 2.25);
  assert.equal(totals.shipping, STANDARD_SHIPPING_FEE);
  // 45 + 2.25 + 5 = 52.25
  assert.equal(totals.total, 52.25);
  assert.equal(totals.itemCount, 1);
});

test('calculateCartTotals gives free shipping at or over threshold', () => {
  const items = [
    { price: 60.0, quantity: 1 },
    { price: 40.0, quantity: 1 },
  ];
  const totals = calculateCartTotals(items);

  assert.equal(totals.subtotal, 100.0);
  assert.equal(totals.shipping, 0);
  // 5% of 100 = 5.0
  assert.equal(totals.tax, 5.0);
  assert.equal(totals.total, 105.0);
  assert.equal(totals.itemCount, 2);
});

test('validatePriceMatch detects tampering or mismatched pricing', () => {
  assert.equal(validatePriceMatch(49.99, 49.99), true);
  assert.equal(validatePriceMatch(10.0, 99.99), false);
  assert.equal(validatePriceMatch(49.994, 49.99), true);
});
