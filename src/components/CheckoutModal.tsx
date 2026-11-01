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
  ExternalLink,
  Truck,
  Check,
  Lock
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200/90 my-8 text-left">
        {/* Top Fintech Notice Bar */}
        <div className="bg-[#101426] text-white px-6 py-2.5 flex items-center justify-between text-xs font-mono border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#36D9F5] animate-pulse"></span>
            <span className="font-bold text-[#36D9F5] uppercase tracking-wider">
              PayPal Sandbox — Test Mode
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">Official test environment • Zero real charges</span>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#101426] tracking-tight">
              Checkout &amp; Verification
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review destination and authorize PayPal Sandbox transaction.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* STEP 1: REVIEW & DESTINATION */}
          {checkoutStep === 'review' && (
            <div className="space-y-6">
              {/* Order Items Snapshot */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Items to Authorize ({cartItems.length})
                </span>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 max-h-40 overflow-y-auto space-y-2.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-slate-200"
                        />
                        <span className="font-bold text-slate-900 truncate max-w-xs">
                          {item.product.name}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          × {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information Form */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Truck className="w-3.5 h-3.5 text-[#7657FF]" />
                  <span>Destination Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] text-slate-800 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={customerInfo.street}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, street: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] text-slate-800 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={customerInfo.state}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={customerInfo.zip}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (5% demo):</span>
                  <span className="font-semibold text-slate-900">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span className="font-semibold text-slate-900">
                    {totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-[#101426]">
                  <span>Authorized Total:</span>
                  <span className="text-base text-[#101426]">
                    ${totals.total.toFixed(2)} {totals.currency}
                  </span>
                </div>
              </div>

              {/* Continue to PayPal Initiation Button */}
              <button
                onClick={handleInitiatePayPalOrder}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white font-bold rounded-xl shadow-md glow-violet transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#36D9F5]" />
                    <span>Initiating PayPal Sandbox Order...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to PayPal Sandbox Authorization</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: AUTHORIZE PAYPAL SANDBOX ORDER */}
          {checkoutStep === 'approving' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Authorize PayPal Sandbox Payment
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  A PayPal Sandbox order has been registered on the server with reference ID:
                </p>
                <div className="mt-2 inline-block font-mono font-bold text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200">
                  {paypalOrderId}
                </div>
              </div>

              {/* PayPal Sandbox official action card */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Sandbox Environment Authorization</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Click the button below to approve and simulate capturing this order on the server.
                  This executes a verified transaction capture without charging real currency.
                </p>
                <div className="text-[11px] font-mono text-amber-900 pt-1 flex justify-between border-t border-amber-200/60">
                  <span>Environment:</span>
                  <span className="font-bold">api-m.sandbox.paypal.com</span>
                </div>
              </div>

              {/* Official PayPal Styled Button */}
              <div className="space-y-2">
                <button
                  onClick={() => handleCapturePayPalOrder(paypalOrderId)}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#003087]" />
                      <span>Capturing Sandbox Transaction...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-black italic text-base">PayPal</span>
                      <span>Approve &amp; Capture PayPal Sandbox Order</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCheckoutStep('review')}
                  disabled={isProcessing}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
                >
                  Cancel and Edit Shipping Information
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION COMPLETED RECEIPT */}
          {checkoutStep === 'completed' && confirmedOrder && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Payment Verified
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your order reference is <strong className="font-mono text-slate-800">{confirmedOrder.id}</strong>
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Payment Status:</span>
                  <span className="font-bold text-emerald-700">{confirmedOrder.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">PayPal Order Ref:</span>
                  <span className="font-bold text-slate-800">{confirmedOrder.paypalOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">PayPal Capture ID:</span>
                  <span className="font-bold text-slate-800">{confirmedOrder.paypalCaptureId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Verified Total:</span>
                  <span className="font-bold text-slate-900 font-sans">
                    ${confirmedOrder.total.toFixed(2)} {confirmedOrder.currency}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-sans">Fulfillment Status:</span>
                  <span className="font-bold text-blue-700 uppercase font-sans">
                    {confirmedOrder.fulfilmentStatus}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#101426] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done &amp; Return to Store
              </button>
            </div>
          )}

          {/* STEP 4: ERROR STATE */}
          {checkoutStep === 'error' && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <AlertCircle className="w-7 h-7 text-rose-600" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Payment Processing Notice
                </h3>
                <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={() => setCheckoutStep('review')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
