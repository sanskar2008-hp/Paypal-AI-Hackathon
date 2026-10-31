import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  RefreshCw, 
  ShoppingBag, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { CartItem, CartTotals, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totals: CartTotals;
  onPaymentSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totals,
  onPaymentSuccess,
  onClearCart,
}) => {
  const [customerInfo, setCustomerInfo] = React.useState({
    name: 'Marcus Vance',
    email: 'm.vance@example.com',
    street: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    country: 'US',
  });

  const [checkoutStep, setCheckoutStep] = React.useState<'review' | 'approving' | 'completed' | 'error'>('review');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmedOrder, setConfirmedOrder] = React.useState<Order | null>(null);
  const [paypalOrderId, setPaypalOrderId] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setCheckoutStep('review');
      setIsProcessing(false);
      setErrorMessage('');
      setConfirmedOrder(null);
      setPaypalOrderId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: Server-side PayPal Order Initiation
  const handleInitiatePayPalOrder = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: customerInfo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize PayPal Sandbox order.');
      }

      setPaypalOrderId(data.paypalOrderId);
      setCheckoutStep('approving');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error initiating PayPal Sandbox checkout.');
      setCheckoutStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Server-side PayPal Order Capture & Verification
  const handleCapturePayPalOrder = async (orderIdToCapture: string) => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: orderIdToCapture,
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email,
          },
          shippingAddress: customerInfo,
          items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'PayPal capture verification failed on server.');
      }

      setConfirmedOrder(data.order);
      setCheckoutStep('completed');
      onClearCart();
      onPaymentSuccess(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to capture PayPal transaction.');
      setCheckoutStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Sandbox Notice Banner */}
        <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="font-bold text-blue-300 uppercase tracking-wider">
              PayPal Sandbox — Test Mode
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">No real money is charged</span>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {checkoutStep === 'completed' ? 'Order Confirmed!' : 'Checkout & Payment'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {checkoutStep === 'completed'
                ? 'Your payment was verified by the server.'
                : 'Review shipping destination and authorize PayPal Sandbox payment.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: REVIEW & ADDRESS */}
          {checkoutStep === 'review' && (
            <div className="space-y-6">
              {/* Order Items Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Order Items ({cartItems.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-md object-cover bg-white border border-slate-200"
                        />
                        <span className="font-medium text-slate-900 truncate max-w-56">
                          {item.product.name} (×{item.quantity})
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Server-Validated Total:</span>
                  <span className="text-blue-600 font-black">
                    ${totals.total.toFixed(2)} {totals.currency}
                  </span>
                </div>
              </div>

              {/* Shipping Details Form */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Demo Shipping Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      value={customerInfo.street}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">State</label>
                      <input
                        type="text"
                        value={customerInfo.state}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">ZIP</label>
                      <input
                        type="text"
                        value={customerInfo.zip}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Proceed to PayPal Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={handleInitiatePayPalOrder}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Validating with Server...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Continue to PayPal Sandbox Authorization
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYPAL APPROVAL / SANDBOX SIMULATOR */}
          {checkoutStep === 'approving' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0070ba] flex items-center justify-center mx-auto border border-blue-200 shadow-2xs">
                <CreditCard className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Authorize PayPal Sandbox Payment
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  A PayPal Sandbox order has been registered on the server with reference ID:
                </p>
                <div className="mt-2 font-mono text-xs bg-slate-100 py-1.5 px-3 rounded-lg text-slate-800 inline-block font-bold">
                  {paypalOrderId}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant Account:</span>
                  <span className="font-semibold text-slate-800">PayPilot Store (Sandbox)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Total:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${totals.total.toFixed(2)} {totals.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Environment:</span>
                  <span className="text-blue-600 font-semibold uppercase">api-m.sandbox.paypal.com</span>
                </div>
              </div>

              <div className="pt-4 max-w-md mx-auto space-y-3">
                <button
                  onClick={() => handleCapturePayPalOrder(paypalOrderId)}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Capturing &amp; Verifying Transaction...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Approve &amp; Capture PayPal Sandbox Order
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCheckoutStep('review')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel and Edit Shipping Information
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMED COMPLETED */}
          {checkoutStep === 'completed' && confirmedOrder && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Payment Verified
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your order reference is <span className="font-mono font-bold text-slate-800">{confirmedOrder.id}</span>
                </p>
              </div>

              {/* Verified Details Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">PayPal Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">{confirmedOrder.paypalOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PayPal Capture ID:</span>
                  <span className="font-mono font-semibold text-slate-800">{confirmedOrder.paypalCaptureId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-extrabold text-slate-900">${confirmedOrder.total.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fulfillment Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px] capitalize">
                    {confirmedOrder.fulfilmentStatus}
                  </span>
                </div>
              </div>

              <div className="pt-4 max-w-md mx-auto flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Done &amp; Return to Store
                </button>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {checkoutStep === 'error' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Authorization Failed</h3>
              <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 max-w-md mx-auto">
                {errorMessage || 'An error occurred during transaction verification.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCheckoutStep('review')}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Return to Checkout Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
