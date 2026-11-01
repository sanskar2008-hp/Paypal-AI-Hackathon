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
  Layers,
  Zap,
  Check,
  Compass,
  Cpu,
  Lock,
  Truck
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
    <div className="flex flex-col min-h-screen bg-[#F7F8FC] text-[#101426]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#101426] via-[#12182F] to-[#101426] text-white pt-16 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 bg-grid-mesh-dark opacity-35 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#7657FF]/20 via-[#4F46E5]/15 to-[#36D9F5]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7657FF]/15 text-[#36D9F5] text-xs font-semibold border border-[#7657FF]/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#36D9F5] animate-pulse" />
                <span>Next-Gen Agentic E-Commerce Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                The Future of Shopping <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7657FF] via-[#9B82FF] to-[#36D9F5]">
                  Is Intelligent.
                </span>
              </h1>

              {/* Tagline & Supporting Copy */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-normal leading-relaxed">
                Discover verified products, compare specifications, and build curated carts with an AI shopping assistant grounded in live search benchmarks and governed by customer approval.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => setActiveTab('storefront')}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white font-bold rounded-xl shadow-lg glow-violet hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 text-base group cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-[#36D9F5] group-hover:scale-110 transition-transform" />
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('assistant')}
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 hover:border-[#36D9F5]/50 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2.5 text-base cursor-pointer"
                >
                  <Bot className="w-5 h-5 text-[#36D9F5]" />
                  <span>Meet Your AI Assistant</span>
                </button>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Catalogue Grounded</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#36D9F5]" />
                  <span>Customer-Confirmed Carts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7657FF]" />
                  <span>Official PayPal Sandbox</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive AI Assistant Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md rounded-2xl bg-[#161B33]/90 border border-[#7657FF]/30 p-5 shadow-2xl backdrop-blur-xl glow-violet">
                {/* Preview Window Header */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7657FF] to-[#36D9F5] flex items-center justify-center text-white font-bold text-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>PayPilot Assistant</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <p className="text-[10px] text-slate-400">Gemini 3.8 Flash • Search Grounded</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7657FF]/20 text-[#36D9F5] border border-[#7657FF]/30">
                    Live Demo
                  </span>
                </div>

                {/* Simulated Conversation Flow */}
                <div className="space-y-3 text-left">
                  {/* User Bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#7657FF] text-white px-3.5 py-2 text-xs font-medium shadow-xs">
                      "Find a creator laptop with all-day battery under $1,000."
                    </div>
                  </div>

                  {/* AI Response Bubble */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-md bg-[#7657FF]/30 text-[#36D9F5] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs bg-slate-800/90 border border-slate-700 text-slate-200 px-3.5 py-2.5 text-xs space-y-2">
                      <p>
                        I matched the <strong className="text-white font-semibold">AeroBook Pro 14" M3</strong> ($849.00) from our active inventory.
                      </p>

                      {/* Mini Recommended Product Card */}
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80"
                            alt="AeroBook Pro"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                          />
                          <div>
                            <span className="text-[11px] font-bold text-white block">
                              AeroBook Pro 14" M3
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              $849.00 • In Stock (12)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('assistant')}
                          className="px-2.5 py-1 text-[10px] font-bold bg-[#7657FF] hover:bg-[#6343F5] text-white rounded-lg transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </div>

                      {/* Safeguard Notice */}
                      <div className="flex items-center gap-1.5 text-[10px] text-[#36D9F5] font-medium pt-1">
                        <ShieldCheck className="w-3 h-3 text-[#36D9F5]" />
                        <span>Agentic Safeguard: Requires customer approval to add.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger Action */}
                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Ready to chat with live AI?</span>
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="text-xs font-bold text-[#36D9F5] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Launch Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES: FOUR PILLARS */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7657FF] mb-2 block">
            Why PayPilot Stands Out
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#101426] tracking-tight">
            Engineered for Integrity, Speed &amp; Accuracy
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Eliminating AI hallucinations and blind autonomous charges with grounded data structures and real payment verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#7657FF]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#7657FF]/10 text-[#7657FF] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#7657FF] uppercase tracking-wider block mb-1">
                Grounded AI
              </span>
              <h3 className="text-lg font-bold text-[#101426] mb-2">
                Catalogue-Grounded Intelligence
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Powered by Gemini 3.8 Flash and live Google Search Grounding to quote verified real-world specs, pricing, and independent benchmarks.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero fabricated products</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#36D9F5]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#36D9F5]/10 text-[#0284C7] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider block mb-1">
                Human-in-the-Loop
              </span>
              <h3 className="text-lg font-bold text-[#101426] mb-2">
                Agentic Cart Safeguards
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                The assistant prepares recommended bundles and compares items, but requires explicit customer confirmation before modifying your cart.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero silent charges</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#101426]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#101426]/10 text-[#101426] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Fintech Verification
              </span>
              <h3 className="text-lg font-bold text-[#101426] mb-2">
                PayPal Sandbox API
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Integrated directly with PayPal Sandbox Orders REST endpoints with server-enforced line math, verified demo taxes, and official capture tokens.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Server-authoritative math</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#7657FF]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7657FF] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TableProperties className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#7657FF] uppercase tracking-wider block mb-1">
                Enterprise Tooling
              </span>
              <h3 className="text-lg font-bold text-[#101426] mb-2">
                AG Grid &amp; GPS Telemetry
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Empowering merchants with AG Grid order tables, Bryntum fulfillment planning, and multi-stage live shipping progress bars for customers.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-time logistics updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED LIVE PRODUCT SHOWCASE */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7657FF] mb-1 block">
                Verified Catalogue
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101426] tracking-tight">
                Featured Hardware &amp; Workspace Essentials
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Each product is indexed for instant AI comparison, query recommendation, and Sandbox purchase.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('storefront')}
              className="text-xs sm:text-sm font-bold text-[#7657FF] hover:text-[#5533F0] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Catalogue Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-[#F7F8FC] rounded-2xl border border-slate-200/90 overflow-hidden hover:border-[#7657FF]/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#101426]/80 text-white backdrop-blur-xs">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-1.5 text-left">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>★ {product.rating.toFixed(1)} ({product.reviewCount})</span>
                      <span className="text-emerald-700 font-semibold">{product.stockQuantity} in stock</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#101426] line-clamp-1 group-hover:text-[#7657FF] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Price and Add to Cart */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-200/60 mt-3 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Price
                    </span>
                    <span className="font-extrabold text-base text-[#101426]">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenProductDetail(product)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#101426] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-3 py-1.5 text-xs font-bold bg-[#7657FF] hover:bg-[#6343F5] text-white rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101426] text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7657FF] to-[#36D9F5] text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">PayPilot Commerce AI</span>
              <p className="text-[11px] text-slate-500">
                Smarter Shopping. Better Decisions. Powered by AI.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={() => setActiveTab('storefront')} className="hover:text-white transition-colors cursor-pointer">
              Storefront
            </button>
            <button onClick={() => setActiveTab('assistant')} className="hover:text-white transition-colors cursor-pointer">
              AI Assistant
            </button>
            <button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors cursor-pointer">
              Order Tracking
            </button>
            <button onClick={() => setActiveTab('seller')} className="hover:text-white transition-colors cursor-pointer">
              Seller Portal
            </button>
          </div>

          <p className="text-slate-500 text-[11px]">
            PayPal Sandbox • Gemini 3.8 Flash • AG Grid • Bryntum
          </p>
        </div>
      </footer>
    </div>
  );
};
