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
  Radio,
  ExternalLink,
  MapPin,
  ArrowRight,
  ShieldCheck,
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
    navigator.clipboard.writeText(trackingNum);
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600 animate-pulse" />
            In Transit
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Processing &amp; Packed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Package className="w-3 h-3 text-slate-500" />
            Order Confirmed
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Header and Live Sync Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Order Tracking &amp; History
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Real-Time GPS &amp; Milestones
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track multi-stage shipping status, carrier dispatch milestones, and verified transaction receipts.
          </p>
        </div>

        {/* Live sync & manual refresh controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="font-semibold text-slate-700">Live Tracker</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400">Synced {lastRefreshedAt}</span>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
              title="Refresh tracking data immediately"
              aria-label="Refresh orders tracking data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>

          <button
            onClick={onExploreProducts}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            When you complete a PayPal Sandbox checkout, your verified transaction receipts and real-time shipping tracking will appear here.
          </p>
          <button
            onClick={onExploreProducts}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
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
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
              >
                {/* Top Summary Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {order.id}
                        </span>
                        {order.isDemoOrder && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                            Sandbox
                          </span>
                        )}
                        <span className="text-xs font-medium text-slate-400">•</span>
                        <span className="text-xs font-semibold text-blue-600">
                          {progressInfo.stageName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>
                          Placed {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">
                          {progressInfo.estimatedDeliveryText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900">
                        ${order.total.toFixed(2)} {order.currency}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.fulfilmentStatus)}
                      <button
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Expand order details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* REAL-TIME SHIPPING PROGRESS BAR SECTION */}
                <div className="px-5 pt-3 pb-5 bg-slate-50/70 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800">
                        Shipping Stage Progression
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        Carrier: UPS Ground ({progressInfo.trackingNumber})
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyTracking(progressInfo.trackingNumber);
                        }}
                        className="text-slate-400 hover:text-blue-600 p-0.5 rounded"
                        title="Copy tracking number"
                        aria-label="Copy tracking number"
                      >
                        {copiedTrackingId === progressInfo.trackingNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
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
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                          title="Advance this order's shipping milestone in real-time"
                        >
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span>Advance Shipping Stage</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Horizontal Continuous Progress Bar */}
                  <div className="relative mb-6 mt-3">
                    {/* Background Track */}
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      {/* Animated Active Progress Fill */}
                      <div
                        style={{ width: `${progressInfo.percentage}%` }}
                        className={`h-full rounded-full transition-all duration-700 ease-in-out ${
                          progressInfo.isComplete
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600'
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
                                  ? 'bg-emerald-600 text-white border-white shadow-xs'
                                  : 'bg-blue-600 text-white border-white shadow-xs'
                                : 'bg-white text-slate-400 border-slate-300'
                            } ${isCurrent && !progressInfo.isComplete ? 'ring-4 ring-blue-100 scale-110' : ''}`}
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
                          className={`p-2 rounded-xl text-left transition-colors ${
                            isCurrent
                              ? 'bg-white border border-blue-200 shadow-2xs'
                              : 'bg-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDone
                                  ? progressInfo.isComplete
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-600'
                                  : 'bg-slate-300'
                              } ${isCurrent ? 'animate-ping' : ''}`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-blue-700'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                            {stage.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Status Milestone Banner */}
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">
                          Current Milestone: {progressInfo.currentMilestone}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {progressInfo.isComplete
                            ? 'Delivered to verified delivery address.'
                            : 'Carrier vehicle equipped with GPS tracking. Estimated dispatch interval: normal.'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                        Progress
                      </span>
                      <span className="text-xs font-mono font-extrabold text-blue-600">
                        {progressInfo.percentage}% Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-200 bg-slate-50/50 space-y-4 text-xs">
                    {/* Items List */}
                    <div>
                      <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                        Purchased Items
                      </h4>
                      <div className="space-y-2 bg-white rounded-xl p-3 border border-slate-200">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                />
                              )}
                              <div>
                                <span className="font-semibold text-slate-900 block">
                                  {item.productName}
                                </span>
                                <span className="text-slate-500 text-[11px]">
                                  Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900">
                              ${item.lineTotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial & Shipping Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Payment Verification Card */}
                      <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          Payment Verification
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status:</span>
                          <span className="font-bold text-emerald-600">
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Method:</span>
                          <span className="font-medium text-slate-700">
                            PayPal Sandbox
                          </span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500">PayPal Ref:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-36">
                            {order.paypalOrderId || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-500">Capture ID:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-36">
                            {order.paypalCaptureId || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Destination */}
                      <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          Destination Address
                        </div>
                        {order.shippingAddress ? (
                          <div className="text-slate-700 space-y-0.5">
                            <p className="font-bold">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                              {order.shippingAddress.zip}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        ) : (
                          <p className="text-slate-400">Standard test destination</p>
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
