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
            <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              Seller Commerce Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8757FF]/15 text-[#43D9FF] text-xs font-bold border border-[#8757FF]/30 font-mono">
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9299B2] mt-1">
            Real-time analytics, inventory management, AG Grid order processing, and AI merchant recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSponsorModal(true)}
            className="px-3.5 py-2.5 bg-[#151A2B] hover:bg-[#1C2236] text-[#9299B2] hover:text-white rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Sponsor Alignment</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#9299B2]" />
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 bg-[#8757FF] hover:bg-[#7644FF] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#8757FF]/25 hover:shadow-[#8757FF]/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* METRIC KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-[#151A2B] p-5 rounded-2xl border border-white/10 shadow-xl hover:border-[#8757FF]/40 transition-all">
          <div className="flex items-center justify-between text-[#9299B2] text-xs font-bold uppercase tracking-wider">
            <span>Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#38D99A]/15 text-[#38D99A] border border-[#38D99A]/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            ${analytics ? analytics.verifiedSales.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-[#38D99A] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>PayPal Sandbox Verified</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#151A2B] p-5 rounded-2xl border border-white/10 shadow-xl hover:border-[#8757FF]/40 transition-all">
          <div className="flex items-center justify-between text-[#9299B2] text-xs font-bold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#43D9FF]/15 text-[#43D9FF] border border-[#43D9FF]/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            {orders.length}
          </div>
          <div className="text-[11px] text-[#9299B2] font-medium mt-1">
            {orders.filter((o) => o.fulfilmentStatus === 'delivered').length} delivered • {orders.filter((o) => o.fulfilmentStatus === 'shipped').length} in transit
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#151A2B] p-5 rounded-2xl border border-white/10 shadow-xl hover:border-[#8757FF]/40 transition-all">
          <div className="flex items-center justify-between text-[#9299B2] text-xs font-bold uppercase tracking-wider">
            <span>Avg Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-[#8757FF]/15 text-[#8757FF] border border-[#8757FF]/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#8757FF]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            ${analytics ? analytics.averageOrderValue.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-[#9299B2] font-medium mt-1">
            Across verified customer checkouts
          </div>
        </div>

        {/* Catalogue Units */}
        <div className="bg-[#151A2B] p-5 rounded-2xl border border-white/10 shadow-xl hover:border-[#8757FF]/40 transition-all">
          <div className="flex items-center justify-between text-[#9299B2] text-xs font-bold uppercase tracking-wider">
            <span>Active Catalogue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
            {products.length} SKUs
          </div>
          <div className="text-[11px] text-[#9299B2] font-medium mt-1">
            {products.reduce((acc, p) => acc + p.stockQuantity, 0)} total units in inventory
          </div>
        </div>
      </div>

      {/* AI MERCHANT INSIGHTS PANEL */}
      <div className="bg-gradient-to-r from-[#101321] via-[#151A2B] to-[#101321] rounded-2xl p-6 text-white border border-[#8757FF]/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#8757FF]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                PayPilot AI Merchant Insights
              </h3>
              <p className="text-xs text-[#9299B2]">
                Continuous telemetry analysis from catalogue sales velocity &amp; customer queries.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#8757FF]/20 text-[#43D9FF] border border-[#8757FF]/30">
            Real-Time Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-[#080A12]/70 p-4 rounded-xl border border-white/5">
            <span className="font-bold text-[#43D9FF] uppercase tracking-wider text-[10px] block mb-1 font-mono">
              Inventory Pacing
            </span>
            <p className="text-[#9299B2] leading-relaxed">
              LuminaBeam Smart Desk Light Bar has high velocity. Consider ordering a replenishment batch within 5 days.
            </p>
          </div>

          <div className="bg-[#080A12]/70 p-4 rounded-xl border border-white/5">
            <span className="font-bold text-[#8757FF] uppercase tracking-wider text-[10px] block mb-1 font-mono">
              Bundle Recommendation
            </span>
            <p className="text-[#9299B2] leading-relaxed">
              Customers frequently prompt the AI assistant for AeroBook Pro + TactileKey Pro. Promoting this combo can lift AOV by ~14%.
            </p>
          </div>

          <div className="bg-[#080A12]/70 p-4 rounded-xl border border-white/5">
            <span className="font-bold text-[#38D99A] uppercase tracking-wider text-[10px] block mb-1 font-mono">
              Fulfilment Efficiency
            </span>
            <p className="text-[#9299B2] leading-relaxed">
              100% of orders over 24h old have progressed to dispatched or delivered status.
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#101321] border border-white/10 rounded-2xl shadow-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1C2236] text-white shadow-md border border-white/10'
              : 'text-[#9299B2] hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#43D9FF]" />
          <span>Analytics &amp; Sales Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('aggrid')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'aggrid'
              ? 'bg-[#1C2236] text-white shadow-md border border-white/10'
              : 'text-[#9299B2] hover:text-white hover:bg-white/5'
          }`}
        >
          <TableProperties className="w-4 h-4 text-[#8757FF]" />
          <span>Order Management (AG Grid)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#8757FF]/20 text-[#8757FF] font-mono">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('catalogue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalogue'
              ? 'bg-[#1C2236] text-white shadow-md border border-white/10'
              : 'text-[#9299B2] hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-[#43D9FF]" />
          <span>Catalogue Editor</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-white font-mono">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scheduler')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'scheduler'
              ? 'bg-[#1C2236] text-white shadow-md border border-white/10'
              : 'text-[#9299B2] hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#8757FF]" />
          <span>Fulfilment Scheduler (Bryntum)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 font-mono">
            {tasks.filter((t) => t.status !== 'completed').length}
          </span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & TRENDS */}
      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales over time chart */}
          <div className="bg-[#151A2B] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-xs font-bold font-['Space_Grotesk'] text-white uppercase tracking-wider">
              Sales Volume by Date ($ USD)
            </h3>
            <div className="space-y-3 pt-2">
              {analytics.salesOverTime.map((pt, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9299B2] font-mono">{pt.date}</span>
                    <span className="font-bold text-white font-mono">
                      ${pt.sales.toFixed(2)} <span className="text-[#9299B2] font-sans">({pt.orders} orders)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#101321] rounded-full overflow-hidden border border-white/5">
                    <div
                      style={{
                        width: `${Math.min(100, (pt.sales / 1200) * 100)}%`,
                      }}
                      className="h-full bg-gradient-to-r from-[#8757FF] to-[#43D9FF] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-[#151A2B] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-xs font-bold font-['Space_Grotesk'] text-white uppercase tracking-wider">
              Category Revenue Distribution
            </h3>
            <div className="space-y-3 pt-2">
              {analytics.categorySales.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9299B2] font-medium">{cat.category}</span>
                    <span className="font-bold text-[#43D9FF] font-mono">
                      ${cat.amount.toFixed(2)} <span className="text-[#9299B2] font-sans">({cat.units} units)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#101321] rounded-full overflow-hidden border border-white/5">
                    <div
                      style={{
                        width: `${Math.min(100, (cat.amount / 1500) * 100)}%`,
                      }}
                      className="h-full bg-[#8757FF] rounded-full"
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Enterprise Order Processing (AG Grid Community)
              </h3>
              <p className="text-xs text-[#9299B2]">
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
        <div className="bg-[#151A2B] rounded-2xl border border-white/10 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Catalogue Inventory Management
              </h3>
              <p className="text-xs text-[#9299B2]">
                Click on prices or stock levels to update catalogue records directly.
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3.5 py-2 bg-[#8757FF] hover:bg-[#7644FF] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#8757FF]/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add SKU</span>
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {products.map((p) => (
              <div
                key={p.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    <span className="text-[11px] text-[#9299B2]">{p.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Price */}
                  <div>
                    <span className="text-[10px] text-[#9299B2] block font-semibold uppercase">Price</span>
                    <button
                      onClick={() => handleEditPrice(p.id, p.price)}
                      className="text-xs font-mono font-bold text-[#43D9FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>${p.price.toFixed(2)}</span>
                      <Edit3 className="w-3 h-3 text-[#9299B2]" />
                    </button>
                  </div>

                  {/* Stock */}
                  <div>
                    <span className="text-[10px] text-[#9299B2] block font-semibold uppercase">Stock</span>
                    <button
                      onClick={() => handleEditStock(p.id, p.stockQuantity)}
                      className="text-xs font-mono font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{p.stockQuantity} units</span>
                      <Edit3 className="w-3 h-3 text-[#9299B2]" />
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
        <div className="bg-[#151A2B] rounded-2xl border border-white/10 p-6 shadow-xl">
          <FulfilmentScheduler
            tasks={tasks}
            onAddTask={onAddTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-[#080A12]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101321] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Add New Catalogue Item
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-[#9299B2] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#9299B2] block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Precision Stylus Pen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white placeholder-[#9299B2] focus:outline-hidden focus:border-[#8757FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#9299B2] block mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Audio & Wearables">Audio &amp; Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#9299B2] block mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#9299B2] block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#9299B2] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Technical features and specs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white placeholder-[#9299B2] focus:outline-hidden focus:border-[#8757FF]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-[#9299B2] hover:text-white rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8757FF] hover:bg-[#7644FF] text-white font-bold rounded-xl shadow-lg shadow-[#8757FF]/25 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#080A12]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101321] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 text-xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-[#43D9FF]">
                  {selectedOrderForInspect.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#38D99A]/15 text-[#38D99A] border border-[#38D99A]/30">
                  {selectedOrderForInspect.paymentStatus}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForInspect(null)}
                className="text-[#9299B2] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-mono bg-[#151A2B] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-[#9299B2] font-sans">Customer:</span>
                <span className="font-bold text-white">{selectedOrderForInspect.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9299B2] font-sans">Email:</span>
                <span className="text-white">{selectedOrderForInspect.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9299B2] font-sans">PayPal Order:</span>
                <span className="text-[#43D9FF]">{selectedOrderForInspect.paypalOrderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9299B2] font-sans">PayPal Capture:</span>
                <span className="text-[#8757FF]">{selectedOrderForInspect.paypalCaptureId || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-white/5 font-bold text-white font-sans">
                <span>Total Amount:</span>
                <span className="text-[#43D9FF]">${selectedOrderForInspect.total.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForInspect(null)}
              className="w-full py-2.5 bg-[#1C2236] hover:bg-[#8757FF] text-white font-bold rounded-xl transition-colors cursor-pointer border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sponsor Alignment Modal */}
      {showSponsorModal && (
        <SponsorIntegrationsModal isOpen={showSponsorModal} onClose={() => setShowSponsorModal(false)} />
      )}
    </div>
  );
};
