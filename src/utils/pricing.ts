import { CartTotals } from '../types';

export const ESTIMATED_TAX_RATE = 0.05; // 5% demo estimate
export const STANDARD_SHIPPING_FEE = 5.0; // $5 flat shipping
export const FREE_SHIPPING_THRESHOLD = 100.0; // free shipping over $100

export function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export interface PricingInputItem {
  price: number;
  quantity: number;
}

export function calculateCartTotals(
  items: PricingInputItem[],
  currency: string = 'USD'
): CartTotals {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      currency,
      isDemoEstimate: true,
      itemCount: 0,
    };
  }

  let subtotal = 0;
  let totalItemCount = 0;

  for (const item of items) {
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    const price = Math.max(0, Number(item.price) || 0);

    subtotal += price * qty;
    totalItemCount += qty;
  }

  subtotal = roundToTwoDecimals(subtotal);

  // Demo tax calculation
  const tax = subtotal > 0 ? roundToTwoDecimals(subtotal * ESTIMATED_TAX_RATE) : 0;

  // Shipping calculation
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;

  const total = roundToTwoDecimals(subtotal + tax + shipping);

  return {
    subtotal,
    tax,
    shipping,
    total,
    currency,
    isDemoEstimate: true,
    itemCount: totalItemCount,
  };
}

export function validatePriceMatch(
  clientPrice: number,
  cataloguePrice: number,
  tolerance: number = 0.01
): boolean {
  return Math.abs(clientPrice - cataloguePrice) <= tolerance;
}
