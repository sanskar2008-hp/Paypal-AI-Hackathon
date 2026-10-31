import React from 'react';
import { 
  Order, 
  Product, 
  SellerAnalytics, 
  FulfilmentTask 
} from '../types';
import { AgGridOrdersTable } from './AgGridOrdersTable';
import { FulfilmentScheduler } from './FulfilmentScheduler';
import { SponsorIntegrationsModal } from './SponsorIntegrationsModal';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Sparkles, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  BarChart2
} from 'lucide-react';

interface SellerDashboardProps {
  analytics: SellerAnalytics | null;
  orders: Order[];
  products: Product[];
  tasks: FulfilmentTask[];
  onUpdateOrderStatus: (orderId: string, status: Order['fulfilmentStatus']) => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  onAddTask: (task: Omit<FulfilmentTask, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, status: FulfilmentTask['status']) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  analytics,
  orders,
  products,
  tasks,
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'aggrid' | 'catalogue' | 'scheduler'>('overview');
  const [showAddProductModal, setShowAddProductModal] = React.useState(false);
  const [showSponsorModal, setShowSponsorModal] = React.useState(false);
  const [selectedOrderForInspect, setSelectedOrderForInspect] = React.useState<Order | null>(null);

  // New Product form state
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    category: 'Electronics' as Product['category'],
    price: 99,
    description: '',
    stockQuantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    attributes: { brand: 'NovaTech', warranty: '1 Year' },
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    onAddProduct(newProduct);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      category: 'Electronics',
      price: 99,
      description: '',
      stockQuantity: 20,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      attributes: { brand: 'NovaTech', warranty: '1 Year' },
    });
  };

  const handleEditPrice = (productId: string, currentPrice: number) => {
    const input = window.prompt(`Enter new price for this product ($ USD):`, currentPrice.toString());
    if (input !== null) {
      const parsed = parseFloat(input);
      if (!isNaN(parsed) && parsed >= 0) {
        onUpdateProduct(productId, { price: parsed });
      }
    }
  };

  const handleEditStock = (productId: string, currentStock: number) => {
    const input = window.prompt(`Enter new available stock quantity:`, currentStock.toString());
    if (input !== null) {
      const parsed = parseInt(input, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        onUpdateProduct(productId, { stockQuantity: parsed, inStock: parsed > 0 });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Seller Commerce Center
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              Demo Data
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time analytics, inventory management, AG Grid order processing, and AI business recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSponsorModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Sponsor Alignment Report</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${analytics ? analytics.verifiedSales.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            100% PayPal Sandbox verified
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {analytics ? analytics.totalOrders : orders.length}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {orders.filter((o) => o.fulfilmentStatus === 'unfulfilled').length} pending dispatch
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${analytics ? analytics.averageOrderValue.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Based on completed transactions
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Active Catalogue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {products.length} Items
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            {products.filter((p) => p.inStock).length} in stock
          </div>
        </div>
      </div>

      {/* AI Business Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 rounded-2xl border border-blue-200/80 p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            PayPilot AI Merchant Insights
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            Automated Intelligence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">
              Inventory Pacing
            </span>
            <h4 className="font-bold text-slate-900 mt-0.5">VividView 4K Monitor Reorder</h4>
            <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
              Inventory is down to 8 units. At current velocity, stockout is projected in 4 days.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
              Bundle Recommendation
            </span>
            <h4 className="font-bold text-slate-900 mt-0.5">Laptop + Ergonomic Mouse</h4>
            <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
              Customers frequently compare AeroBook Pro with wireless ergonomics accessories.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
              Fulfilment Efficiency
            </span>
            <h4 className="font-bold text-slate-900 mt-0.5">Zero Delivery Bottlenecks</h4>
            <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
              100% of orders over 24h old have progressed to dispatched or delivered status.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Analytics &amp; Sales Trends
        </button>

        <button
          onClick={() => setActiveTab('aggrid')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'aggrid'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Order Management (AG Grid)</span>
          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('catalogue')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'catalogue'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Catalogue Editor</span>
          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px]">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scheduler')}
          className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'scheduler'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Fulfilment Scheduler (Bryntum)</span>
          <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px]">
            {tasks.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW CHARTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales over time SVG chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Sales Velocity (Past 7 Days)
                </h3>
                <p className="text-xs text-slate-400">Verified transaction totals in USD</p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Live Revenue Trend
              </span>
            </div>

            {analytics && analytics.salesOverTime && analytics.salesOverTime.length > 0 ? (
              <div className="mt-4 h-48 flex items-end gap-3 pt-6 border-b border-slate-200">
                {analytics.salesOverTime.map((day, idx) => {
                  const maxSale = Math.max(...analytics.salesOverTime.map((d) => d.sales), 100);
                  const heightPercent = Math.max(12, Math.round((day.sales / maxSale) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700">
                        ${day.sales}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-lg transition-all"
                        title={`${day.date}: $${day.sales} (${day.orders} orders)`}
                      />
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {day.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">No sales history yet.</p>
            )}
          </div>

          {/* Category Sales Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Category Revenue Distribution
                </h3>
                <p className="text-xs text-slate-400">Sales volume by product category</p>
              </div>
              <BarChart2 className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-3 mt-4">
              {analytics && analytics.categorySales && analytics.categorySales.length > 0 ? (
                analytics.categorySales.map((cat) => {
                  const maxAmount = Math.max(...analytics.categorySales.map((c) => c.amount), 1);
                  const barWidth = Math.round((cat.amount / maxAmount) * 100);

                  return (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{cat.category}</span>
                        <span className="text-slate-900 font-bold">${cat.amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          style={{ width: `${barWidth}%` }}
                          className="bg-indigo-600 h-full rounded-full transition-all"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">No category data available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AG GRID ORDERS TABLE */}
      {activeTab === 'aggrid' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">
                AG Grid Order Management Environment
              </span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Sort, filter, and inspect verified PayPal Sandbox orders. Use the fulfilment selector to update logistical statuses.
              </p>
            </div>
          </div>

          <AgGridOrdersTable
            orders={orders}
            onUpdateStatus={onUpdateOrderStatus}
            onViewOrderDetail={(order) => setSelectedOrderForInspect(order)}
          />
        </div>
      )}

      {/* TAB 3: CATALOGUE EDITOR */}
      {activeTab === 'catalogue' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Active Catalogue Products ({products.length})
            </h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price ($)</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-56">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{p.category}</td>
                    <td className="p-3 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="p-3 text-slate-700">{p.stockQuantity}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          onUpdateProduct(p.id, { inStock: !p.inStock })
                        }
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.inStock ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditPrice(p.id, p.price)}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded font-semibold text-[11px]"
                      >
                        Edit Price
                      </button>
                      <button
                        onClick={() => handleEditStock(p.id, p.stockQuantity)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded font-semibold text-[11px]"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FULFILMENT SCHEDULER */}
      {activeTab === 'scheduler' && (
        <FulfilmentScheduler
          tasks={tasks}
          onAddTask={onAddTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
        />
      )}

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Add New Catalogue Product
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Ergonomic Keyboard Stand"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Audio & Wearables">Audio & Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Initial Stock Units</label>
                <input
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter specifications and features..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {selectedOrderForInspect && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Order Detail — {selectedOrderForInspect.id}
              </h3>
              <button
                onClick={() => setSelectedOrderForInspect(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold">{selectedOrderForInspect.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold">{selectedOrderForInspect.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total:</span>
                <span className="font-bold text-slate-900">${selectedOrderForInspect.total.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PayPal Reference:</span>
                <span className="font-mono">{selectedOrderForInspect.paypalOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfilment Status:</span>
                <span className="font-bold uppercase text-blue-600">
                  {selectedOrderForInspect.fulfilmentStatus}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedOrderForInspect(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Integrations Modal */}
      <SponsorIntegrationsModal
        isOpen={showSponsorModal}
        onClose={() => setShowSponsorModal(false)}
      />
    </div>
  );
};
