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
  BarChart2,
  TableProperties,
  ArrowRight
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 text-left">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black text-[#101426] tracking-tight">
              Seller Commerce Center
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-[#7657FF]/10 text-[#7657FF] text-xs font-bold border border-[#7657FF]/25">
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, inventory management, AG Grid order processing, and AI merchant recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSponsorModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200/90 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span>Sponsor Alignment</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md glow-violet transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* METRIC KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#7657FF]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101426] mt-2">
            ${analytics ? analytics.verifiedSales.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Server Authoritative PayPal Sandbox</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#7657FF]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101426] mt-2">
            {orders.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {orders.filter((o) => o.fulfilmentStatus === 'delivered').length} delivered • {orders.filter((o) => o.fulfilmentStatus === 'shipped').length} in transit
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#7657FF]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Avg Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7657FF] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#7657FF]" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101426] mt-2">
            ${analytics ? analytics.averageOrderValue.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Across verified customer checkouts
          </div>
        </div>

        {/* Catalogue Units */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#7657FF]/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Catalogue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101426] mt-2">
            {products.length} SKUs
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {products.reduce((acc, p) => acc + p.stockQuantity, 0)} total units in inventory
          </div>
        </div>
      </div>

      {/* AI MERCHANT INSIGHTS PANEL */}
      <div className="bg-gradient-to-r from-[#101426] via-[#161B33] to-[#101426] rounded-2xl p-6 text-white border border-[#7657FF]/35 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7657FF] to-[#36D9F5] flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                PayPilot AI Merchant Insights
              </h3>
              <p className="text-xs text-slate-300">
                Continuous telemetry analysis from catalogue sales velocity &amp; customer queries.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#7657FF]/20 text-[#36D9F5] border border-[#7657FF]/30">
            Real-Time Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80">
            <span className="font-bold text-[#36D9F5] uppercase tracking-wider text-[10px] block mb-1">
              Inventory Pacing
            </span>
            <p className="text-slate-300 leading-relaxed">
              LuminaBeam Smart Desk Light Bar has high velocity (22 left). Consider ordering a replenishment batch in 5 days.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80">
            <span className="font-bold text-[#7657FF] uppercase tracking-wider text-[10px] block mb-1">
              Bundle Recommendation
            </span>
            <p className="text-slate-300 leading-relaxed">
              Customers frequently prompt the AI assistant for AeroBook Pro + TactileKey Pro. Promoting this combo can lift AOV by ~14%.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
              Fulfilment Efficiency
            </span>
            <p className="text-slate-300 leading-relaxed">
              100% of orders over 24h old have progressed to dispatched or delivered status.
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#101426] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#36D9F5]" />
          <span>Analytics &amp; Sales Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('aggrid')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'aggrid'
              ? 'bg-[#101426] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TableProperties className="w-4 h-4 text-[#7657FF]" />
          <span>Order Management (AG Grid)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#7657FF]/20 text-[#7657FF]">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('catalogue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalogue'
              ? 'bg-[#101426] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-[#36D9F5]" />
          <span>Catalogue Editor</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scheduler')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'scheduler'
              ? 'bg-[#101426] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#7657FF]" />
          <span>Fulfilment Scheduler (Bryntum)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            {tasks.filter((t) => t.status !== 'completed').length}
          </span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & TRENDS */}
      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales over time chart simulation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#101426] uppercase tracking-wider">
              Sales Volume by Date ($ USD)
            </h3>
            <div className="space-y-3 pt-2">
              {analytics.salesOverTime.map((pt, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{pt.date}</span>
                    <span className="font-bold text-[#101426]">
                      ${pt.sales.toFixed(2)} ({pt.orders} orders)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, (pt.sales / 1200) * 100)}%`,
                      }}
                      className="h-full bg-gradient-to-r from-[#7657FF] to-[#36D9F5] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#101426] uppercase tracking-wider">
              Category Revenue Distribution
            </h3>
            <div className="space-y-3 pt-2">
              {analytics.categorySales.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{cat.category}</span>
                    <span className="font-bold text-[#101426]">
                      ${cat.amount.toFixed(2)} ({cat.units} units)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, (cat.amount / 1500) * 100)}%`,
                      }}
                      className="h-full bg-[#7657FF] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AG GRID ORDERS TABLE */}
      {activeTab === 'aggrid' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#101426]">
                Enterprise Order Processing (AG Grid Community)
              </h3>
              <p className="text-xs text-slate-500">
                Filter by ID, search by customer, update fulfillment statuses, and inspect cryptographic receipts.
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#101426]">
                Catalogue Inventory Management
              </h3>
              <p className="text-xs text-slate-500">
                Click on prices or stock levels to update catalogue records directly.
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 bg-[#7657FF] hover:bg-[#6343F5] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add SKU</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.map((p) => (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#101426]">{p.name}</h4>
                    <span className="text-[11px] text-slate-500">{p.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Price */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Price</span>
                    <button
                      onClick={() => handleEditPrice(p.id, p.price)}
                      className="text-xs font-extrabold text-[#7657FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>${p.price.toFixed(2)}</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  {/* Stock */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Stock</span>
                    <button
                      onClick={() => handleEditStock(p.id, p.stockQuantity)}
                      className="text-xs font-extrabold text-slate-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{p.stockQuantity} units</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULER (BRYNTUM) */}
      {activeTab === 'scheduler' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <FulfilmentScheduler
            tasks={tasks}
            orders={orders}
            onAddTask={onAddTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Add New Catalogue Item
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Precision Stylus Pen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7657FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7657FF]"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Audio & Wearables">Audio &amp; Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7657FF]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7657FF]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Technical features and specs..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7657FF]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7657FF] hover:bg-[#6343F5] text-white font-bold rounded-xl"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {selectedOrderForInspect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-[#7657FF]">
                  {selectedOrderForInspect.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {selectedOrderForInspect.paymentStatus}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForInspect(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Customer:</span>
                <span className="font-bold">{selectedOrderForInspect.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Email:</span>
                <span>{selectedOrderForInspect.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">PayPal Order:</span>
                <span>{selectedOrderForInspect.paypalOrderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">PayPal Capture:</span>
                <span>{selectedOrderForInspect.paypalCaptureId || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-slate-900 font-sans">
                <span>Total Amount:</span>
                <span>${selectedOrderForInspect.total.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForInspect(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sponsor Alignment Modal */}
      {showSponsorModal && (
        <SponsorIntegrationsModal onClose={() => setShowSponsorModal(false)} />
      )}
    </div>
  );
};
