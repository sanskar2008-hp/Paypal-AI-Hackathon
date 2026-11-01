import React from 'react';
import { Order } from '../types';
import { 
  History, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag,
  CreditCard,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  getShippingStageProgress, 
  getNextShippingStage, 
  SHIPPING_STAGES 
} from '../utils/tracking';

interface OrderHistoryProps {
  orders: Order[];
  onExploreProducts: () => void;
  onRefreshOrders?: () => Promise<void>;
  onUpdateOrderStatus?: (orderId: string, status: Order['fulfilmentStatus']) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ 
  orders, 
  onExploreProducts,
  onRefreshOrders,
  onUpdateOrderStatus,
}) => {
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [copiedTrackingId, setCopiedTrackingId] = React.useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Auto-poll in real time every 6 seconds if enabled
  React.useEffect(() => {
    if (!autoRefreshEnabled || !onRefreshOrders) return;

    const interval = setInterval(async () => {
      try {
        await onRefreshOrders();
        setLastRefreshedAt(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } catch (err) {
        // Silent background sync
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, onRefreshOrders]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleManualRefresh = async () => {
    if (!onRefreshOrders) return;
    setIsRefreshing(true);
    try {
      await onRefreshOrders();
      setLastRefreshedAt(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard?.writeText(trackingNum);
    setCopiedTrackingId(trackingNum);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  const handleAdvanceStage = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateOrderStatus) return;
    const nextStatus = getNextShippingStage(order.fulfilmentStatus);
    onUpdateOrderStatus(order.id, nextStatus);
  };

  const getStatusBadge = (status: Order['fulfilmentStatus']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#38D99A]/15 text-[#38D99A] border border-[#38D99A]/30">
            <CheckCircle2 className="w-3 h-3 text-[#38D99A]" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#43D9FF]/15 text-[#43D9FF] border border-[#43D9FF]/30">
            <Truck className="w-3 h-3 text-[#43D9FF] animate-pulse" />
            In Transit
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8757FF]/15 text-[#8757FF] border border-[#8757FF]/30">
            <Package className="w-3 h-3 text-[#8757FF]" />
            Confirmed
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
      {/* Header and Live Sync Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              Order Tracking &amp; History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8757FF]/15 text-[#43D9FF] text-xs font-bold border border-[#8757FF]/30 font-mono">
              Live GPS &amp; Milestones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9299B2] mt-1">
            Track multi-stage shipping status, carrier dispatch milestones, and verified transaction receipts.
          </p>
        </div>

        {/* Live sync & manual refresh controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151A2B] border border-white/10 text-xs shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-[#38D99A] animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="font-semibold text-white">Live Sync</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-[11px] text-[#9299B2] font-mono">{lastRefreshedAt}</span>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1 text-[#9299B2] hover:text-[#43D9FF] hover:bg-white/5 rounded-md transition-colors cursor-pointer"
              title="Refresh tracking data immediately"
              aria-label="Refresh orders tracking data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#43D9FF]' : ''}`} />
            </button>
          </div>

          <button
            onClick={onExploreProducts}
            className="px-4 py-2 bg-[#8757FF] hover:bg-[#7644FF] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#8757FF]/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#43D9FF]" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#151A2B] rounded-2xl border border-white/10 p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#101321] text-[#9299B2] flex items-center justify-center mx-auto mb-4 border border-white/5">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-[#9299B2] max-w-sm mx-auto mt-1 mb-6">
            When you complete a PayPal Sandbox checkout, your verified transaction receipts and real-time shipping tracking will appear here.
          </p>
          <button
            onClick={onExploreProducts}
            className="px-5 py-2.5 bg-[#8757FF] hover:bg-[#7644FF] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#8757FF]/25 cursor-pointer"
          >
            Start Exploring Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const progressInfo = getShippingStageProgress(
              order.fulfilmentStatus,
              order.id,
              order.createdAt
            );

            return (
              <div
                key={order.id}
                className="bg-[#151A2B] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-[#8757FF]/30 transition-all"
              >
                {/* Top Summary Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#101321] text-[#43D9FF] flex items-center justify-center font-bold text-xs shrink-0 border border-white/10">
                      <Truck className="w-5 h-5 text-[#43D9FF]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">
                          {order.id}
                        </span>
                        {order.isDemoOrder && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#9299B2] border border-white/10">
                            Sandbox
                          </span>
                        )}
                        <span className="text-xs font-medium text-white/20">•</span>
                        <span className="text-xs font-semibold text-[#43D9FF]">
                          {progressInfo.stageName}
                        </span>
                      </div>
                      <div className="text-xs text-[#9299B2] mt-0.5 flex items-center gap-2">
                        <span>
                          Placed {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span className="text-[#38D99A] font-medium">
                          {progressInfo.estimatedDeliveryText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-[#43D9FF]">
                        ${order.total.toFixed(2)} {order.currency}
                      </div>
                      <div className="text-[11px] text-[#9299B2]">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.fulfilmentStatus)}
                      <button
                        className="p-1 text-[#9299B2] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        aria-label="Expand order details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* REAL-TIME SHIPPING PROGRESS BAR SECTION */}
                <div className="px-5 pt-3 pb-5 bg-[#101321] border-t border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">
                        Shipping Stage Progression
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="font-mono text-[11px] text-[#9299B2]">
                        Carrier: UPS Ground ({progressInfo.trackingNumber})
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyTracking(progressInfo.trackingNumber);
                        }}
                        className="text-[#9299B2] hover:text-[#43D9FF] p-0.5 rounded cursor-pointer"
                        title="Copy tracking number"
                        aria-label="Copy tracking number"
                      >
                        {copiedTrackingId === progressInfo.trackingNumber ? (
                          <Check className="w-3.5 h-3.5 text-[#38D99A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Interactive Demo Progression Control */}
                    {onUpdateOrderStatus && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleAdvanceStage(order, e)}
                          className="px-3 py-1.5 text-[11px] font-bold bg-[#151A2B] hover:bg-[#8757FF]/20 text-[#43D9FF] border border-[#8757FF]/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                          title="Advance this order's shipping milestone in real-time"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#8757FF]" />
                          <span>Advance Shipping Stage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Horizontal Continuous Progress Bar */}
                  <div className="relative mb-6 mt-3">
                    {/* Background Track */}
                    <div className="h-2 w-full bg-[#151A2B] rounded-full overflow-hidden border border-white/5">
                      {/* Animated Active Progress Fill */}
                      <div
                        style={{ width: `${progressInfo.percentage}%` }}
                        className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                          progressInfo.isComplete
                            ? 'bg-[#38D99A]'
                            : 'bg-gradient-to-r from-[#8757FF] via-[#7644FF] to-[#43D9FF]'
                        }`}
                      />
                    </div>

                    {/* Stage Milestones along the track */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none">
                      {SHIPPING_STAGES.map((stage, idx) => {
                        const isDone = idx <= progressInfo.stepIndex;
                        const isCurrent = idx === progressInfo.stepIndex;

                        return (
                          <div
                            key={stage.id}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                              isDone
                                ? progressInfo.isComplete
                                  ? 'bg-[#38D99A] text-slate-900 border-[#101321] shadow-lg shadow-[#38D99A]/30'
                                  : 'bg-[#8757FF] text-white border-[#101321] shadow-lg shadow-[#8757FF]/30'
                                : 'bg-[#151A2B] text-[#9299B2] border-white/20'
                            } ${isCurrent && !progressInfo.isComplete ? 'ring-4 ring-[#8757FF]/30 scale-110' : ''}`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <span className="text-[10px]">{idx + 1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage Labels Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    {SHIPPING_STAGES.map((stage, idx) => {
                      const isDone = idx <= progressInfo.stepIndex;
                      const isCurrent = idx === progressInfo.stepIndex;

                      return (
                        <div
                          key={stage.id}
                          className={`p-2.5 rounded-xl text-left transition-colors ${
                            isCurrent
                              ? 'bg-[#151A2B] border border-[#8757FF]/40 shadow-lg'
                              : 'bg-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDone
                                  ? progressInfo.isComplete
                                    ? 'bg-[#38D99A]'
                                    : 'bg-[#43D9FF]'
                                  : 'bg-white/20'
                              } ${isCurrent ? 'animate-ping' : ''}`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-[#43D9FF]'
                                  : isDone
                                  ? 'text-white'
                                  : 'text-[#9299B2]'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#9299B2] mt-1 line-clamp-2 leading-tight">
                            {stage.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Status Milestone Banner */}
                  <div className="mt-3.5 p-3.5 bg-[#151A2B] rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#38D99A]/15 text-[#38D99A] border border-[#38D99A]/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#38D99A]" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          Current Milestone: {progressInfo.currentMilestone}
                        </span>
                        <span className="text-[11px] text-[#9299B2]">
                          {progressInfo.isComplete
                            ? 'Delivered to verified delivery address.'
                            : 'Carrier vehicle equipped with GPS tracking. Estimated dispatch interval: normal.'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-[10px] font-bold uppercase text-[#9299B2] block tracking-wider font-mono">
                        Progress
                      </span>
                      <span className="text-xs font-mono font-bold text-[#43D9FF]">
                        {progressInfo.percentage}% Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-white/5 bg-[#080A12]/50 space-y-4 text-xs">
                    {/* Items List */}
                    <div>
                      <h4 className="font-bold text-[#9299B2] uppercase tracking-wider text-[11px] mb-2 font-mono">
                        Purchased Items
                      </h4>
                      <div className="space-y-2 bg-[#151A2B] rounded-xl p-3 border border-white/5">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10"
                                />
                              )}
                              <div>
                                <span className="font-semibold text-white block">
                                  {item.productName}
                                </span>
                                <span className="text-[#9299B2] text-[11px]">
                                  Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-[#43D9FF]">
                              ${item.lineTotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial & Shipping Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Payment Verification Card */}
                      <div className="bg-[#151A2B] rounded-xl p-3.5 border border-white/5 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-white text-[11px] uppercase tracking-wider mb-2 font-mono">
                          <CreditCard className="w-3.5 h-3.5 text-[#43D9FF]" />
                          Payment Verification
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9299B2]">Status:</span>
                          <span className="font-bold text-[#38D99A]">
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9299B2]">Method:</span>
                          <span className="font-medium text-white">
                            PayPal Sandbox
                          </span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-[#9299B2] font-sans">PayPal Ref:</span>
                          <span className="font-semibold text-[#43D9FF] truncate max-w-36">
                            {order.paypalOrderId || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-[#9299B2] font-sans">Capture ID:</span>
                          <span className="font-semibold text-[#8757FF] truncate max-w-36">
                            {order.paypalCaptureId || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Destination */}
                      <div className="bg-[#151A2B] rounded-xl p-3.5 border border-white/5 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-white text-[11px] uppercase tracking-wider mb-2 font-mono">
                          <Truck className="w-3.5 h-3.5 text-[#8757FF]" />
                          Destination Address
                        </div>
                        {order.shippingAddress ? (
                          <div className="text-[#9299B2] space-y-0.5">
                            <p className="font-bold text-white">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                              {order.shippingAddress.zip}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        ) : (
                          <p className="text-[#9299B2]">Standard test destination</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
