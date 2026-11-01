import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Plus, Minus, Check } from 'lucide-react';
import { CartItem, CartTotals } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);
  const freeShippingProgress = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101321] h-full shadow-2xl flex flex-col justify-between border-l border-white/10 text-left text-[#F5F6FF]">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#151A2B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] flex items-center justify-center text-white font-bold text-xs shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">YOUR SHOPPING CART</h2>
              <span className="text-[11px] text-[#9299B2] font-mono">
                {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-[#151A2B]/60 border-b border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold font-label mb-2">
            <div className="flex items-center gap-1.5 text-white/90">
              <Truck className="w-4 h-4 text-[#43D9FF]" />
              {amountToFreeShipping > 0 ? (
                <span>Add <strong className="text-[#43D9FF]">${amountToFreeShipping.toFixed(2)}</strong> for Free Delivery</span>
              ) : (
                <span className="text-[#38D99A] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Free Shipping Unlocked!
                </span>
              )}
            </div>
            <span className="text-[#9299B2] text-[11px] font-mono">
              ${freeShippingThreshold}.00 goal
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#080A12] rounded-full overflow-hidden">
            <div
              style={{ width: `${freeShippingProgress}%` }}
              className="h-full bg-gradient-to-r from-[#8757FF] to-[#43D9FF] transition-all duration-300"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white/5 text-[#9299B2] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold font-display text-white">Your cart is empty</h3>
              <p className="text-xs text-[#9299B2] max-w-xs mx-auto">
                Discover verified products in our catalogue or converse with our AI shopping assistant.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2.5 bg-[#8757FF] hover:bg-[#9569FF] text-white text-xs font-bold font-display rounded-xl transition-colors cursor-pointer"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all bg-[#151A2B] shadow-xl"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-white/10 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold font-display text-white truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-[#9299B2] hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[#9299B2] text-[11px] mt-0.5 font-mono">
                    ${item.product.price.toFixed(2)} each
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/10 rounded-xl bg-[#101321]">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-[#9299B2] hover:text-white rounded-l-xl transition-colors cursor-pointer text-xs"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold font-mono text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-[#9299B2] hover:text-white rounded-r-xl transition-colors cursor-pointer text-xs"
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black font-display text-sm text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Price Breakdown and PayPal CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#151A2B] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#9299B2]">
                <span className="font-label">Subtotal</span>
                <span className="font-bold font-mono text-white">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-[#9299B2]">
                <span className="font-label">Estimated Tax (5% demo)</span>
                <span className="font-bold font-mono text-white">
                  ${totals.tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-[#9299B2]">
                <span className="font-label">Shipping</span>
                <span className="font-bold font-mono text-white">
                  {totals.shipping === 0 ? (
                    <span className="text-[#38D99A] font-bold">FREE ($100+ order)</span>
                  ) : (
                    `$${totals.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold font-display text-white">
                <span>ESTIMATED TOTAL</span>
                <span className="text-base text-white">
                  ${totals.total.toFixed(2)} {totals.currency}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#9299B2] bg-[#101321] p-3 rounded-xl border border-white/5">
              Verified server calculation. Total is confirmed server-side prior to PayPal token issuance.
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-4 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white font-bold font-display rounded-2xl shadow-xl glow-violet-refined transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm tracking-wider uppercase"
            >
              <span>PROCEED TO PAYPAL SANDBOX CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-[#43D9FF]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
