import React from 'react';
import { 
  Bot, 
  ShoppingBag, 
  Layers, 
  LayoutDashboard, 
  History, 
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export type ActiveTab = 'landing' | 'storefront' | 'assistant' | 'orders' | 'seller';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartItemCount: number;
  openCart: () => void;
  isPayPalConfigured: boolean;
  wishlistCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItemCount,
  openCart,
  isPayPalConfigured,
  wishlistCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; isAi?: boolean }[] = [
    { id: 'landing', label: 'Home', icon: <Layers className="w-4 h-4" /> },
    { id: 'storefront', label: 'Storefront', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4" />, isAi: true },
    { id: 'orders', label: 'Tracking & Orders', icon: <History className="w-4 h-4" /> },
    { id: 'seller', label: 'Seller Portal', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top Fintech Notice Bar */}
      <div className="bg-[#101426] text-slate-300 text-xs py-1.5 px-4 font-mono border-b border-slate-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#7657FF]/20 text-[#36D9F5] text-[11px] font-semibold tracking-wide uppercase border border-[#7657FF]/35">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36D9F5] animate-pulse"></span>
              PayPal Sandbox — Test Mode
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Server-verified transactions with zero real financial charges.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 hidden md:inline">
              Catalogue Grounded • Gemini 3.8 Flash
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-semibold">System Operational</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 text-left focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] rounded-xl p-1 group transition-transform"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7657FF] via-[#4F46E5] to-[#36D9F5] text-white flex items-center justify-center font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="tracking-tighter">P</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#36D9F5] border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#101426]">
                  PayPilot
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-[#7657FF]/10 text-[#7657FF] border border-[#7657FF]/20">
                  AI Commerce
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Intelligent Shopping &amp; Seller Platform
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-[#101426] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#101426] hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-[#36D9F5]' : 'text-slate-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.isAi && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#7657FF] animate-pulse"></span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#7657FF] to-[#36D9F5] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Cart Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              aria-label={`Shopping Cart with ${cartItemCount} items`}
              className="relative flex items-center gap-2.5 px-3.5 py-2 text-sm font-semibold text-[#101426] bg-white border border-slate-200/90 rounded-xl hover:border-[#7657FF]/50 hover:bg-[#7657FF]/5 focus:outline-hidden focus:ring-2 focus:ring-[#7657FF] transition-all shadow-2xs group"
            >
              <ShoppingBag className="w-4 h-4 text-slate-600 group-hover:text-[#7657FF] transition-colors" />
              <span className="hidden sm:inline">Cart</span>
              <span
                data-testid="cart-badge-count"
                className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                  cartItemCount > 0
                    ? 'bg-gradient-to-r from-[#7657FF] to-[#4F46E5] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cartItemCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-[#101426] hover:bg-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#7657FF]"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200/80 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#101426] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#36D9F5]' : 'text-slate-400'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  {link.isAi && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#7657FF]/20 text-[#36D9F5]">
                      Gemini 3.8
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
