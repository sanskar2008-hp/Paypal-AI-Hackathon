import React from 'react';
import { 
  Bot, 
  ShoppingBag, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  SlidersHorizontal, 
  Layers, 
  Cpu, 
  Lock, 
  Zap,
  Star,
  Check
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
    <div className="flex flex-col min-h-screen bg-[#080A12] text-[#F5F6FF]">
      {/* 1. HERO SECTION: Split-Layout with Neo-Futuristic Showcase */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 border-b border-white/10 bg-mesh-dark">
        {/* Atmospheric lighting effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#8757FF]/20 via-[#6836F5]/10 to-[#43D9FF]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Small Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151A2B] text-[#43D9FF] text-xs font-bold font-label tracking-widest uppercase border border-[#8757FF]/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#43D9FF] animate-pulse" />
                <span>NEXT-GENERATION AI COMMERCE</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.02]">
                SHOP SMARTER. <br />
                <span className="text-gradient-neo">
                  THINK BIGGER.
                </span>
              </h1>

              {/* Exact Supporting Text */}
              <p className="text-base sm:text-lg text-[#9299B2] max-w-xl font-normal leading-relaxed">
                Discover a new way to shop. Let intelligent AI guide your decisions, compare products, and simplify your shopping journey.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => setActiveTab('storefront')}
                  className="px-8 py-4 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white font-extrabold font-display rounded-2xl shadow-xl glow-violet-refined transition-all duration-200 flex items-center justify-center gap-3 text-sm tracking-wider uppercase group cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#43D9FF] group-hover:scale-110 transition-transform" />
                  <span>EXPLORE THE STORE</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('assistant')}
                  className="px-8 py-4 bg-[#151A2B] hover:bg-[#1C2236] text-[#F5F6FF] font-bold font-display rounded-2xl border border-white/10 hover:border-[#43D9FF]/50 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm tracking-wider uppercase cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#43D9FF]" />
                  <span>MEET YOUR AI</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#9299B2] font-label font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#38D99A]" />
                  <span>Verified Catalogue Inventory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#43D9FF]" />
                  <span>Explicit Customer Approvals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8757FF]" />
                  <span>PayPal Developer Sandbox</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Interactive Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md rounded-3xl bg-[#101321]/90 border border-white/10 p-6 shadow-2xl backdrop-blur-xl glow-violet-refined">
                {/* Showcase Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-display text-white flex items-center gap-2">
                        <span>PayPilot Intelligent Core</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38D99A] animate-pulse"></span>
                      </div>
                      <p className="text-[10px] text-[#9299B2]">Gemini 3.8 Flash • Search Grounded</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#8757FF]/20 text-[#43D9FF] border border-[#8757FF]/30">
                    Live Engine
                  </span>
                </div>

                {/* Layered Showcase Cards */}
                <div className="space-y-3.5 text-left">
                  {/* Floating Prompt Card */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#8757FF] text-white px-4 py-2.5 text-xs font-medium shadow-md">
                      "Find the best creator laptop with all-day battery under $1,000."
                    </div>
                  </div>

                  {/* AI Response Card */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-[#151A2B] text-[#43D9FF] flex items-center justify-center shrink-0 border border-white/10">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs bg-[#151A2B] border border-white/10 text-[#F5F6FF] p-4 text-xs space-y-3 shadow-lg">
                      <p className="text-[#9299B2] leading-relaxed">
                        I matched the <strong className="text-white font-semibold">AeroBook Pro 14" M3</strong> ($849.00) from our active inventory with 18 hours of tested battery life.
                      </p>

                      {/* Interactive Product Preview Mini-Card */}
                      <div className="p-3 rounded-xl bg-[#101321] border border-white/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=140&q=80"
                            alt="AeroBook Pro"
                            className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/10"
                          />
                          <div>
                            <span className="text-xs font-bold font-display text-white block">
                              AeroBook Pro 14" M3
                            </span>
                            <span className="text-[11px] text-[#38D99A] font-mono font-bold">
                              $849.00 • In Stock (18)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('storefront')}
                          className="px-3 py-1.5 text-xs font-bold bg-[#8757FF] hover:bg-[#9569FF] text-white rounded-lg transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </div>

                      {/* Agentic Safeguard Label */}
                      <div className="flex items-center gap-1.5 text-[10px] text-[#43D9FF] font-semibold pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#43D9FF]" />
                        <span>Agentic Safeguard: Customer approval required before cart assembly.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Showcase Action */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#9299B2]">Ready to converse with live AI?</span>
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="font-bold text-[#43D9FF] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
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

      {/* 2. SECTION: THE INTELLIGENCE LAYER (01 / 02 / 03) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-white/10">
        <div className="text-left max-w-2xl mb-14">
          <span className="text-xs font-bold font-label uppercase tracking-widest text-[#8757FF] mb-2 block">
            CORE PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            THE INTELLIGENCE LAYER
          </h2>
          <p className="mt-2 text-sm text-[#9299B2]">
            Three foundational pillars uniting grounded artificial intelligence with deterministic fintech execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <div className="p-8 rounded-3xl bg-[#101321] border border-white/10 hover:border-[#8757FF]/40 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <span className="text-3xl font-black font-display text-white/20 group-hover:text-[#8757FF] transition-colors block mb-6">
                01
              </span>
              <span className="text-[11px] font-bold font-label uppercase tracking-wider text-[#43D9FF] block mb-1">
                NATURAL LANGUAGE SEARCH
              </span>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                AI DISCOVERY
              </h3>
              <p className="text-xs sm:text-sm text-[#9299B2] leading-relaxed">
                Find products through intelligent conversations. The assistant analyzes user constraints against our real catalogue while citing live web benchmarks for endurance and performance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#38D99A] font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Grounded in active catalogue stock</span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="p-8 rounded-3xl bg-[#101321] border border-white/10 hover:border-[#43D9FF]/40 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <span className="text-3xl font-black font-display text-white/20 group-hover:text-[#43D9FF] transition-colors block mb-6">
                02
              </span>
              <span className="text-[11px] font-bold font-label uppercase tracking-wider text-[#8757FF] block mb-1">
                SIDE-BY-SIDE MATRIX
              </span>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                SMART COMPARISON
              </h3>
              <p className="text-xs sm:text-sm text-[#9299B2] leading-relaxed">
                Understand differences and make informed decisions. Compare up to 3 hardware models side-by-side with unrecorded attributes transparently marked "Not available".
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#38D99A] font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Zero fabricated product specifications</span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="p-8 rounded-3xl bg-[#101321] border border-white/10 hover:border-[#38D99A]/40 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <span className="text-3xl font-black font-display text-white/20 group-hover:text-[#38D99A] transition-colors block mb-6">
                03
              </span>
              <span className="text-[11px] font-bold font-label uppercase tracking-wider text-[#38D99A] block mb-1">
                VERIFIED REST CHECKOUT
              </span>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                SEAMLESS CHECKOUT
              </h3>
              <p className="text-xs sm:text-sm text-[#9299B2] leading-relaxed">
                Experience a streamlined shopping journey with PayPal Developer Platform Sandbox. Calculations are enforced on the server to prevent price tampering.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#38D99A] font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Official PayPal Sandbox Capture API</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: FEATURED PRODUCTS (Editorial Grid) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold font-label uppercase tracking-widest text-[#8757FF] mb-1 block">
              CURATED HARDWARE &amp; WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
              FEATURED PRODUCTS
            </h2>
            <p className="text-xs sm:text-sm text-[#9299B2] mt-1">
              Editorial selection of verified items indexed for instant fuzzy matching, AI comparison, and Sandbox purchase.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('storefront')}
            className="text-xs sm:text-sm font-bold font-display text-[#43D9FF] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>VIEW COMPLETE CATALOGUE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Editorial Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-[#101321] rounded-3xl border border-white/10 overflow-hidden hover:border-[#8757FF]/40 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group text-left"
            >
              <div>
                {/* Large Image Container */}
                <div
                  onClick={() => onOpenProductDetail(product)}
                  className="relative h-60 overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold font-label px-2.5 py-1 rounded-lg bg-[#080A12]/80 text-[#43D9FF] backdrop-blur-md border border-white/10">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#9299B2]">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                      <span className="text-[#9299B2]">({product.reviewCount})</span>
                    </div>
                    <span className="text-[#38D99A] font-semibold text-[11px]">
                      {product.stockQuantity} in stock
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenProductDetail(product)}
                    className="font-bold font-display text-base text-white line-clamp-1 group-hover:text-[#43D9FF] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#9299B2] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4 pt-4">
                <div>
                  <span className="text-[10px] text-[#9299B2] uppercase font-label tracking-wider block">
                    PRICE
                  </span>
                  <span className="font-black font-display text-xl text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenProductDetail(product)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#9299B2] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-3.5 py-1.5 text-xs font-bold bg-[#8757FF] hover:bg-[#9569FF] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#43D9FF]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECTION: YOUR PERSONAL AI SHOPPER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-white/10">
        <div className="rounded-3xl bg-gradient-to-r from-[#101321] via-[#151A2B] to-[#101321] border border-[#8757FF]/35 p-8 sm:p-12 text-left relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold font-label uppercase tracking-widest text-[#43D9FF] block">
                INTELLIGENT ASSISTANCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
                YOUR PERSONAL AI SHOPPER
              </h2>
              <p className="text-sm text-[#9299B2] leading-relaxed max-w-xl">
                Experience a tailored shopping companion that understands technical specifications, compares hardware options, and prepares bundles according to your exact budget.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium">
                  "Find a college laptop under $1000"
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium">
                  "Compare noise cancelling headphones"
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium">
                  "Complete ergonomic standing desk bundle"
                </span>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 shadow-lg glow-violet-refined cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#43D9FF]" />
                  <span>START CHATTING WITH ASSISTANT</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#080A12] p-5 rounded-2xl border border-white/10 text-xs space-y-3 font-mono">
              <div className="text-[10px] text-[#43D9FF] uppercase tracking-wider font-bold flex items-center justify-between">
                <span>AI SHOPPER TELEMETRY</span>
                <span className="text-[#38D99A]">LIVE</span>
              </div>
              <p className="text-white/80">
                User: "I need a high-power laptop for video editing."
              </p>
              <div className="p-3 rounded-xl bg-[#151A2B] border border-white/5 text-[#9299B2] space-y-1.5">
                <p className="text-white font-sans text-xs">
                  PayPilot AI: "Matched AeroBook Pro 14" M3 ($849.00) with 16GB Unified RAM and 512GB NVMe. Cited benchmark: 18h video playback."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-[#43D9FF]">
                  <ShieldCheck className="w-3 h-3 text-[#43D9FF]" />
                  <span>Awaiting Customer Confirmation to Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: TRUSTED COMMERCE EXPERIENCE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-white/10 text-left">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold font-label uppercase tracking-widest text-[#43D9FF] mb-2 block">
            SECURITY &amp; COMPLIANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            TRUSTED COMMERCE EXPERIENCE
          </h2>
          <p className="text-sm text-[#9299B2] mt-2">
            Every transaction is verified through the official PayPal Developer Platform Sandbox. Price calculations and tax estimations are handled server-side to prevent tampering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#101321] border border-white/10 space-y-2">
            <h4 className="text-sm font-bold font-display text-white">1. Grounded Search</h4>
            <p className="text-xs text-[#9299B2] leading-relaxed">
              Every item recommended by our AI is cross-referenced with real catalogue stock and pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101321] border border-white/10 space-y-2">
            <h4 className="text-sm font-bold font-display text-white">2. Customer Control</h4>
            <p className="text-xs text-[#9299B2] leading-relaxed">
              No silent cart mutations or autonomous credit card charges. Everything requires your approval.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101321] border border-white/10 space-y-2">
            <h4 className="text-sm font-bold font-display text-white">3. Sandbox Testing</h4>
            <p className="text-xs text-[#9299B2] leading-relaxed">
              Test payments safely using PayPal Developer Sandbox REST Orders and Capture endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECTION: FINAL CTA */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold font-label uppercase tracking-widest text-[#8757FF] block">
          THE NEXT GENERATION OF E-COMMERCE
        </span>
        <h2 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
          READY TO SHOP INTELLIGENTLY?
        </h2>
        <p className="text-base text-[#9299B2] max-w-xl mx-auto">
          Explore our complete verified catalogue, test the real-time fuzzy search bar, or converse with our AI assistant.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setActiveTab('storefront')}
            className="px-9 py-4 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white font-black font-display rounded-2xl shadow-xl glow-violet-refined transition-all flex items-center gap-3 text-sm tracking-wider uppercase cursor-pointer"
          >
            <span>START EXPLORING</span>
            <ArrowRight className="w-4 h-4 text-[#43D9FF]" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080A12] text-[#9299B2] py-12 border-t border-white/10 text-xs text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <span className="font-extrabold font-display text-white text-sm">PAYPILOT COMMERCE AI</span>
              <p className="text-[11px] text-[#9299B2]">
                "THE FUTURE OF COMMERCE IS INTELLIGENT."
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => setActiveTab('storefront')} className="hover:text-white transition-colors cursor-pointer">
              Explore Products
            </button>
            <button onClick={() => setActiveTab('assistant')} className="hover:text-white transition-colors cursor-pointer">
              AI Assistant
            </button>
            <button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors cursor-pointer">
              Tracking &amp; Orders
            </button>
            <button onClick={() => setActiveTab('seller')} className="hover:text-white transition-colors cursor-pointer">
              Seller Portal
            </button>
          </div>

          <p className="text-[11px] text-white/40 font-mono">
            PayPal Sandbox • Gemini 3.8 Flash • AG Grid
          </p>
        </div>
      </footer>
    </div>
  );
};
