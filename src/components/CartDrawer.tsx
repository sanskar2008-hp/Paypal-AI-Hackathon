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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#101426] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7657FF] to-[#36D9F5] flex items-center justify-center text-white font-bold text-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
              <span className="text-[11px] text-slate-400">
                {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Truck className="w-4 h-4 text-[#7657FF]" />
              {amountToFreeShipping > 0 ? (
                <span>Add <strong className="text-[#7657FF]">${amountToFreeShipping.toFixed(2)}</strong> for Free Delivery</span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Free Shipping Unlocked!
                </span>
              )}
            </div>
            <span className="text-slate-400 text-[11px] font-mono">
              ${freeShippingThreshold}.00 target
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              style={{ width: `${freeShippingProgress}%` }}
              className="h-full bg-gradient-to-r from-[#7657FF] to-[#36D9F5] transition-all duration-300"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our product catalogue or ask our AI assistant for personalised recommendations.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 bg-[#101426] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all bg-white shadow-2xs"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-[#101426] truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-slate-500 text-[11px] mt-0.5 font-medium">
                    ${item.product.price.toFixed(2)} each
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-l-lg transition-colors cursor-pointer text-xs"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold font-mono text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-r-lg transition-colors cursor-pointer text-xs"
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-xs text-[#101426]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and PayPal Sandbox CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (5% demo)</span>
                <span className="font-semibold text-slate-900">
                  ${totals.tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE ($100+ order)</span>
                  ) : (
                    `$${totals.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-[#101426]">
                <span>Estimated Total</span>
                <span className="text-base text-[#101426]">
                  ${totals.total.toFixed(2)} {totals.currency}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/80">
              Verified server calculation. Total is confirmed server-side prior to PayPal token issuance.
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white font-bold rounded-xl shadow-md glow-violet transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Proceed to PayPal Sandbox Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
