/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Storefront } from './components/Storefront';
import { AiAssistant } from './components/AiAssistant';
import { OrderHistory } from './components/OrderHistory';
import { SellerDashboard } from './components/SellerDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CartItem, CartTotals, Order, Product, ProposedCartItem, FulfilmentTask, SellerAnalytics } from './types';
import { calculateCartTotals } from './utils/pricing';
import { applyAgenticCartProposals } from './utils/cartRules';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('landing');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [tasks, setTasks] = React.useState<FulfilmentTask[]>([]);
  const [analytics, setAnalytics] = React.useState<SellerAnalytics | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
  const [isPayPalConfigured, setIsPayPalConfigured] = React.useState(false);

  // Cart State
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [cartTotals, setCartTotals] = React.useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD',
    isDemoEstimate: true,
    itemCount: 0,
  });

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = React.useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [comparedProducts, setComparedProducts] = React.useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = React.useState(false);

  // Toast / notification feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Data Fetching from Server
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Error fetching tasks:', e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/seller/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.analytics || null);
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/payments/paypal/config');
      if (res.ok) {
        const data = await res.json();
        setIsPayPalConfigured(data.isLiveConfigured);
      }
    } catch (e) {
      // Ignore
    }
  };

  React.useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchTasks();
    fetchAnalytics();
    fetchConfig();
  }, []);

  // 2. Cart Totals Synchronization
  React.useEffect(() => {
    const totals = calculateCartTotals(
      cartItems.map((i) => ({ price: i.product.price, quantity: i.quantity })),
      'USD'
    );
    setCartTotals(totals);
  }, [cartItems]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!product.inStock || product.stockQuantity <= 0) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(
          product.stockQuantity,
          updated[existingIndex].quantity + quantity
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { productId: product.id, product, quantity }];
    });

    showToast(`Added ${quantity} × ${product.name} to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const maxStock = item.product.stockQuantity || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Agentic proposed cart application with explicit customer confirmation
  const handleApplyProposedCart = (proposals: ProposedCartItem[]) => {
    const result = applyAgenticCartProposals(cartItems, proposals, products, true);
    setCartItems(result.updatedCart);
    showToast(`Applied ${result.appliedItems.length} proposed items to your shopping cart!`);
  };

  // Comparison Operations
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 products at a time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleOpenCompareWithIds = (productIds: string[]) => {
    const selected = products.filter((p) => productIds.includes(p.id)).slice(0, 3);
    setComparedProducts(selected);
    setIsCompareModalOpen(true);
  };

  // Product Detail Modal
  const handleOpenProductDetail = (product: Product) => {
    setSelectedDetailProduct(product);
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
    setRelatedProducts(related);
  };

  // Seller Dashboard Actions
  const handleUpdateOrderStatus = async (orderId: string, status: Order['fulfilmentStatus']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfilmentStatus: status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, fulfilmentStatus: status } : o))
        );
        fetchAnalytics();
        showToast(`Order ${orderId} status updated to ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [data.product, ...prev]);
        showToast(`Created product: ${data.product.name}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p))
        );
        showToast(`Updated product specifications`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (taskData: Omit<FulfilmentTask, 'id'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => [data.task, ...prev]);
        showToast(`Fulfilment task scheduled`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: FulfilmentTask['status']) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Payment Confirmation
  const handlePaymentSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    fetchAnalytics();
    fetchTasks();
    showToast(`Payment verified! Order ${newOrder.id} confirmed.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={cartTotals.itemCount}
        openCart={() => setIsCartOpen(true)}
        isPayPalConfigured={isPayPalConfigured}
      />

      {/* Views Routing */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            featuredProducts={products}
            onOpenProductDetail={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'storefront' && (
          <Storefront
            products={products}
            isLoading={isLoadingProducts}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={handleOpenProductDetail}
            comparedProducts={comparedProducts}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareModalOpen(true)}
            onClearCompare={() => setComparedProducts([])}
            onOpenAssistant={() => setActiveTab('assistant')}
          />
        )}

        {activeTab === 'assistant' && (
          <AiAssistant
            products={products}
            onAddToCart={handleAddToCart}
            onApplyProposedCart={handleApplyProposedCart}
            onOpenCompareWithIds={handleOpenCompareWithIds}
            onOpenProductDetail={handleOpenProductDetail}
          />
        )}

        {activeTab === 'orders' && (
          <OrderHistory
            orders={orders}
            onExploreProducts={() => setActiveTab('storefront')}
            onRefreshOrders={fetchOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'seller' && (
          <SellerDashboard
            analytics={analytics}
            orders={orders}
            products={products}
            tasks={tasks}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        totals={cartTotals}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totals={cartTotals}
        onPaymentSuccess={handlePaymentSuccess}
        onClearCart={handleClearCart}
      />

      {/* Product Detail Dialog */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
        relatedProducts={relatedProducts}
        onSelectRelated={handleOpenProductDetail}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareModalOpen}
        products={comparedProducts}
        onClose={() => setIsCompareModalOpen(false)}
        onAddToCart={handleAddToCart}
        onRemoveProduct={(id) =>
          setComparedProducts((prev) => prev.filter((p) => p.id !== id))
        }
        onClearAll={() => setComparedProducts([])}
      />
    </div>
  );
}
