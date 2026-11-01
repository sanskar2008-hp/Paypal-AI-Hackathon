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
  Truck,
  Lock,
  Copy,
  Check
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
  const [copiedId, setCopiedId] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setCheckoutStep('review');
      setIsProcessing(false);
      setErrorMessage('');
      setConfirmedOrder(null);
      setPaypalOrderId('');
      setCopiedId(false);
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

  const handleCopyOrderId = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080A12]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#101321] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/10 my-8 text-left">
        {/* Top Sandbox Notice Bar */}
        <div className="bg-[#080A12] px-6 py-2.5 flex items-center justify-between text-xs font-mono border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#43D9FF] animate-pulse"></span>
            <span className="font-bold text-[#43D9FF] uppercase tracking-wider text-[11px]">
              PayPal Sandbox — Test Mode
            </span>
          </div>
          <span className="text-[#9299B2] text-[11px]">Official test environment • Zero real charges</span>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              Checkout &amp; Verification
            </h2>
            <p className="text-xs text-[#9299B2] mt-0.5">
              Review destination and authorize PayPal Sandbox transaction.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9299B2] hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
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
                <span className="text-[11px] font-bold text-[#9299B2] uppercase tracking-wider block">
                  Items to Authorize ({cartItems.length})
                </span>
                <div className="bg-[#151A2B] rounded-xl p-4 border border-white/5 max-h-40 overflow-y-auto space-y-2.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover bg-black/40 border border-white/10"
                        />
                        <span className="font-medium text-white truncate max-w-xs">
                          {item.product.name}
                        </span>
                        <span className="text-[#9299B2] text-[11px]">
                          × {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information Form */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <Truck className="w-3.5 h-3.5 text-[#8757FF]" />
                  <span>Destination Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF] font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF] font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={customerInfo.street}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF] font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={customerInfo.state}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF] font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={customerInfo.zip}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, zip: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF] font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-4 rounded-xl bg-[#151A2B] border border-white/5 text-xs space-y-2">
                <div className="flex justify-between text-[#9299B2]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#9299B2]">
                  <span>Tax (5% demo):</span>
                  <span className="font-semibold text-white">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#9299B2]">
                  <span>Shipping:</span>
                  <span className="font-semibold text-[#38D99A]">
                    {totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Authorized Total:</span>
                  <span className="text-base text-[#43D9FF] font-mono">
                    ${totals.total.toFixed(2)} {totals.currency}
                  </span>
                </div>
              </div>

              {/* Continue to PayPal Initiation Button */}
              <button
                onClick={handleInitiatePayPalOrder}
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#8757FF] hover:bg-[#7644FF] text-white font-bold rounded-xl shadow-lg shadow-[#8757FF]/25 hover:shadow-[#8757FF]/40 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#43D9FF]" />
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
              <div className="w-16 h-16 rounded-2xl bg-[#151A2B] text-[#43D9FF] flex items-center justify-center mx-auto border border-[#43D9FF]/20 shadow-lg shadow-[#43D9FF]/10">
                <CreditCard className="w-8 h-8 text-[#43D9FF]" />
              </div>

              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  Authorize PayPal Sandbox Payment
                </h3>
                <p className="text-xs text-[#9299B2] mt-1 max-w-md mx-auto">
                  A PayPal Sandbox order has been registered on the server with reference ID:
                </p>
                <div className="mt-2.5 inline-flex items-center gap-2 font-mono font-bold text-xs bg-[#151A2B] text-[#43D9FF] px-3.5 py-1.5 rounded-lg border border-white/10">
                  <span>{paypalOrderId}</span>
                  <button 
                    onClick={() => handleCopyOrderId(paypalOrderId)}
                    className="p-1 hover:text-white cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-[#38D99A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* PayPal Sandbox official action card */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Sandbox Environment Authorization</span>
                </div>
                <p className="text-amber-200/90 text-[11px] leading-relaxed">
                  Click the button below to approve and simulate capturing this order on the server.
                  This executes a verified transaction capture without charging real currency.
                </p>
                <div className="text-[11px] font-mono text-amber-300 pt-1 flex justify-between border-t border-amber-500/20">
                  <span>Environment:</span>
                  <span className="font-bold">api-m.sandbox.paypal.com</span>
                </div>
              </div>

              {/* Official PayPal Styled Button */}
              <div className="space-y-3">
                <button
                  onClick={() => handleCapturePayPalOrder(paypalOrderId)}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer hover:brightness-105"
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
                  className="text-xs text-[#9299B2] hover:text-white transition-colors py-1 cursor-pointer"
                >
                  Cancel and Edit Shipping Information
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION COMPLETED RECEIPT */}
          {checkoutStep === 'completed' && confirmedOrder && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-[#38D99A]/10 text-[#38D99A] flex items-center justify-center mx-auto border border-[#38D99A]/20 shadow-lg shadow-[#38D99A]/10">
                <CheckCircle2 className="w-8 h-8 text-[#38D99A]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#38D99A] block mb-1">
                  Payment Verified
                </span>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-[#9299B2] mt-1">
                  Your order reference is <strong className="font-mono text-white">{confirmedOrder.id}</strong>
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="bg-[#151A2B] rounded-xl p-4 border border-white/5 text-xs text-left space-y-2.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#9299B2] font-sans">Payment Status:</span>
                  <span className="font-bold text-[#38D99A]">{confirmedOrder.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9299B2] font-sans">PayPal Order Ref:</span>
                  <span className="font-bold text-white">{confirmedOrder.paypalOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9299B2] font-sans">PayPal Capture ID:</span>
                  <span className="font-bold text-white">{confirmedOrder.paypalCaptureId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9299B2] font-sans">Verified Total:</span>
                  <span className="font-bold text-[#43D9FF] font-sans">
                    ${confirmedOrder.total.toFixed(2)} {confirmedOrder.currency}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-white/5">
                  <span className="text-[#9299B2] font-sans">Fulfillment Status:</span>
                  <span className="font-bold text-[#8757FF] uppercase font-sans">
                    {confirmedOrder.fulfilmentStatus}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1C2236] hover:bg-[#8757FF] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer border border-white/10"
              >
                Done &amp; Return to Store
              </button>
            </div>
          )}

          {/* STEP 4: ERROR STATE */}
          {checkoutStep === 'error' && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                <AlertCircle className="w-7 h-7 text-rose-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  Payment Processing Notice
                </h3>
                <p className="text-xs text-rose-400 mt-1 max-w-md mx-auto">
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={() => setCheckoutStep('review')}
                className="px-5 py-2.5 bg-[#1C2236] hover:bg-[#8757FF] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-white/10"
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
