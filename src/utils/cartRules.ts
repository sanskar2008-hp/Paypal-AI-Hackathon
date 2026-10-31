import { CartItem, Product, ProposedCartItem } from '../types';

export interface CartOperationResult {
  updatedCart: CartItem[];
  appliedItems: ProposedCartItem[];
  rejectedItems: { productId: string; reason: string }[];
  requiresApproval: boolean;
}

/**
 * Agentic Safeguard:
 * An AI assistant can propose items to add or modify in a cart,
 * but changes MUST NOT be applied without explicit customer confirmation.
 */
export function applyAgenticCartProposals(
  currentCart: CartItem[],
  proposals: ProposedCartItem[],
  catalogue: Product[],
  customerConfirmed: boolean
): CartOperationResult {
  if (!customerConfirmed) {
    return {
      updatedCart: [...currentCart],
      appliedItems: [],
      rejectedItems: proposals.map((p) => ({
        productId: p.productId,
        reason: 'Customer confirmation required before altering cart.',
      })),
      requiresApproval: true,
    };
  }

  const updatedCart: CartItem[] = [...currentCart];
  const appliedItems: ProposedCartItem[] = [];
  const rejectedItems: { productId: string; reason: string }[] = [];

  for (const proposal of proposals) {
    const product = catalogue.find((p) => p.id === proposal.productId);

    if (!product) {
      rejectedItems.push({
        productId: proposal.productId,
        reason: 'Product does not exist in active catalogue.',
      });
      continue;
    }

    if (!product.inStock || product.stockQuantity <= 0) {
      rejectedItems.push({
        productId: proposal.productId,
        reason: `${product.name} is currently out of stock.`,
      });
      continue;
    }

    const requestedQty = Math.max(1, Math.floor(proposal.quantity || 1));
    const availableQty = Math.min(requestedQty, product.stockQuantity);

    const existingIndex = updatedCart.findIndex(
      (item) => item.productId === product.id
    );

    if (existingIndex >= 0) {
      const newTotalQty = Math.min(
        updatedCart[existingIndex].quantity + availableQty,
        product.stockQuantity
      );
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: newTotalQty,
      };
    } else {
      updatedCart.push({
        productId: product.id,
        product,
        quantity: availableQty,
      });
    }

    appliedItems.push({
      productId: product.id,
      quantity: availableQty,
      reason: proposal.reason,
    });
  }

  return {
    updatedCart,
    appliedItems,
    rejectedItems,
    requiresApproval: false,
  };
}

export function sanitizeQuantity(quantity: number, maxStock: number = 99): number {
  const parsed = Math.floor(Number(quantity));
  if (isNaN(parsed) || parsed < 1) return 1;
  return Math.min(parsed, Math.max(1, maxStock));
}
