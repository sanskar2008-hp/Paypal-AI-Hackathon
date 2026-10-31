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
  CreditCard
} from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  onExploreProducts: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onExploreProducts }) => {
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusBadge = (status: Order['fulfilmentStatus']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3" />
            Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <Package className="w-3 h-3" />
            Unfulfilled
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Order History
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Verified Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review your verified PayPal Sandbox transactions and tracked shipment milestones.
          </p>
        </div>

        <button
          onClick={onExploreProducts}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            When you complete a PayPal Sandbox checkout, your verified transaction receipts will be recorded here.
          </p>
          <button
            onClick={onExploreProducts}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Start Exploring Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                      <Package className="w-5 h-5 text-slate-500" />
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
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        className="p-1 text-slate-400 hover:text-slate-600"
                        aria-label="Expand order details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
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
