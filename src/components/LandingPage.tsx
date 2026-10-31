import React from 'react';
import { 
  Bot, 
  ShoppingBag, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  SlidersHorizontal,
  TableProperties,
  Clock,
  Layers
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { Product } from '../types';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  featuredProducts: Product[];
  onOpenProductDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  featuredProducts,
  onOpenProductDetail,
  onAddToCart,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold mb-6 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Agentic Commerce with Google Search Grounding & PayPal Sandbox</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Smarter Shopping. Better Decisions.{' '}
            <span className="text-blue-600">Powered by AI.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover products, compare your options, and shop with an intelligent assistant.
            Give sellers the insights they need to manage commerce more effectively.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('storefront')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore Products
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-medium rounded-xl border border-slate-300 shadow-2xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Bot className="w-5 h-5 text-blue-600" />
              Meet Your AI Shopping Assistant
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
            <div className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Catalogue Grounded</div>
            </div>
            <div className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-blue-600">User-Approved</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Agentic Cart Preparation</div>
            </div>
            <div className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900">Sandbox API</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Official PayPal Orders</div>
            </div>
            <div className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-blue-600">AG Grid</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Enterprise Order Table</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel/Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Curated Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Popular Catalogue Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore verified items ready for AI comparison, cart assembly, and Sandbox checkout.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('storefront')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all catalogue products <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200">
                  {product.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                  In Stock ({product.stockQuantity})
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.entries(product.attributes)
                      .slice(0, 2)
                      .map(([key, val]) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-600 rounded font-mono"
                        >
                          {String(val)}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Catalogue Price</span>
                    <span className="text-lg font-bold text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProductDetail(product)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Engineered for Modern Commerce
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              End-to-End Capabilities Built with Integrity
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Every workflow—from natural language product inquiries to AG Grid order fulfillment—operates against server-validated data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Search-Grounded AI Assistant
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Powered by Gemini 3.8 Flash with Google Search Grounding tool. Provides accurate, real-world tech specifications while grounding suggestions in the store catalogue.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Customer-Approved Agentic Flow
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                The AI can assemble a proposed shopping cart based on your criteria, but never charges or alters quantities without your explicit one-click confirmation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                PayPal Sandbox Orders API
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Official server-side PayPal order creation and payment capture. Real verification prevents client-side tampering, clearly labelled as Sandbox Test Mode.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Multi-Product Comparison
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Compare up to three products side-by-side across dimensions, battery life, weight, and connectivity. Transparently displays "Not available" when an attribute is unrecorded.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <TableProperties className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                AG Grid Seller Operations
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                High-performance AG Grid order table with column sorting, filtering, pagination, and fulfillment workflow updates designed for commercial sellers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Seller Analytics & Insights
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Real-time metrics computed directly from completed transactions. Includes AI-powered inventory alerts, bundle opportunity scoring, and velocity tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Sandbox Testing Disclosure */}
      <section className="py-14 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            PayPal Sandbox Testing Environment
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            PayPilot Commerce AI connects to the official PayPal Sandbox API for development and evaluation. 
            All checkouts operate in a secure, simulated financial sandbox. No credit cards are charged real funds. 
            Our server validates all prices and line items independently before transaction token issuance.
          </p>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center text-xs">P</div>
              PayPilot Commerce AI
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An intelligent commerce assistant connecting customer product discovery, agentic cart preparation, PayPal Sandbox payments, and seller operations.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Customer Journeys</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-white transition-colors">
                  Product Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('assistant')} className="hover:text-white transition-colors">
                  AI Shopping Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors">
                  Order Tracking & History
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Seller & Operations</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('seller')} className="hover:text-white transition-colors">
                  Seller Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('seller')} className="hover:text-white transition-colors">
                  AG Grid Order Management
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('seller')} className="hover:text-white transition-colors">
                  AI Inventory Insights
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Compliance & Integrity</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Built for hackathon demonstration. Products and orders are initialised with marked demo data. No video generation or editing functionality is contained in this software.
            </p>
            <div className="mt-3 text-[11px] text-slate-500">
              © 2026 PayPilot Commerce AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
