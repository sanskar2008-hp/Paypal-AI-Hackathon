import test from 'node:test';
import assert from 'node:assert/strict';
import { getShippingStageProgress, getNextShippingStage, SHIPPING_STAGES } from './tracking';

test('SHIPPING_STAGES has 4 logical progressive stages', () => {
  assert.equal(SHIPPING_STAGES.length, 4);
  assert.equal(SHIPPING_STAGES[0].id, 'unfulfilled');
  assert.equal(SHIPPING_STAGES[1].id, 'processing');
  assert.equal(SHIPPING_STAGES[2].id, 'shipped');
  assert.equal(SHIPPING_STAGES[3].id, 'delivered');
});

test('getShippingStageProgress computes percentage correctly', () => {
  const pUnfulfilled = getShippingStageProgress('unfulfilled', 'ORD-1234', '2026-10-30T10:00:00Z');
  assert.equal(pUnfulfilled.stepIndex, 0);
  assert.equal(pUnfulfilled.percentage, 15);
  assert.equal(pUnfulfilled.isComplete, false);

  const pProcessing = getShippingStageProgress('processing', 'ORD-1234', '2026-10-30T10:00:00Z');
  assert.equal(pProcessing.stepIndex, 1);
  assert.equal(pProcessing.percentage, 45);

  const pShipped = getShippingStageProgress('shipped', 'ORD-1234', '2026-10-30T10:00:00Z');
  assert.equal(pShipped.stepIndex, 2);
  assert.equal(pShipped.percentage, 78);

  const pDelivered = getShippingStageProgress('delivered', 'ORD-1234', '2026-10-30T10:00:00Z');
  assert.equal(pDelivered.stepIndex, 3);
  assert.equal(pDelivered.percentage, 100);
  assert.equal(pDelivered.isComplete, true);
});

test('getNextShippingStage advances states in linear sequence', () => {
  assert.equal(getNextShippingStage('unfulfilled'), 'processing');
  assert.equal(getNextShippingStage('processing'), 'shipped');
  assert.equal(getNextShippingStage('shipped'), 'delivered');
  assert.equal(getNextShippingStage('delivered'), 'unfulfilled');
});
