import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {totals.itemCount}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Explore our product catalogue or ask our AI assistant for personalised recommendations.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            items.map(({ productId, product, quantity }) => (
              <div
                key={productId}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(productId)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5">
                    ${product.price.toFixed(2)} each
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(productId, quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-semibold text-slate-800 min-w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(productId, quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                        aria-label={`Increase quantity of ${product.name}`}
                        disabled={quantity >= product.stockQuantity}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm font-extrabold text-slate-900">
                      ${(product.price * quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5% demo)</span>
                <span className="font-semibold text-slate-900">
                  ${totals.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE ($100+ order)</span>
                  ) : (
                    `$${totals.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Estimated Total</span>
                <span className="text-lg font-black text-blue-600">
                  ${totals.total.toFixed(2)} {totals.currency}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Sandbox demo estimate. Final verified order total is recalculated server-side prior to PayPal token issuance.
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
