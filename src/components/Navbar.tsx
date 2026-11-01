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
  ArrowRight,
  Info,
  User,
  LogOut
} from 'lucide-react';

export type ActiveTab = 'landing' | 'storefront' | 'assistant' | 'orders' | 'seller';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartItemCount: number;
  openCart: () => void;
  isPayPalConfigured: boolean;
  onOpenAbout: () => void;
  onOpenAuth: () => void;
  currentUser: { name: string; email: string; role: 'customer' | 'seller' } | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItemCount,
  openCart,
  isPayPalConfigured,
  onOpenAbout,
  onOpenAuth,
  currentUser,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; isAi?: boolean }[] = [
    { id: 'landing', label: 'Home', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'storefront', label: 'Explore Products', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'assistant', label: 'AI Assistant', icon: <Bot className="w-3.5 h-3.5" />, isAi: true },
    { id: 'orders', label: 'Tracking & Orders', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'seller', label: 'Seller Portal', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080A12]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top Fintech Notice Bar */}
      <div className="bg-[#101321] text-[#9299B2] text-[11px] py-1.5 px-4 font-mono border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#8757FF]/15 text-[#43D9FF] font-semibold tracking-wide uppercase border border-[#8757FF]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43D9FF] animate-pulse"></span>
              PAYPAL SANDBOX — TEST MODE
            </span>
            <span className="hidden sm:inline text-white/40 text-[11px]">
              Server-verified transactions with zero financial charges.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-white/50">
              Gemini 3.8 Flash • Search Grounded
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#38D99A]"></span>
            <span className="text-[#38D99A] font-semibold">Operational</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 text-left focus:outline-hidden focus:ring-2 focus:ring-[#8757FF] rounded-xl p-1 group transition-transform cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8757FF] via-[#6836F5] to-[#43D9FF] text-white flex items-center justify-center font-black font-display text-xl shadow-lg group-hover:scale-105 transition-transform">
              <span>P</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#43D9FF] border-2 border-[#080A12]"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-display tracking-tight text-white">
                  PayPilot
                </span>
                <span className="text-[9px] font-extrabold uppercase font-label tracking-widest px-1.5 py-0.5 rounded bg-[#8757FF]/20 text-[#43D9FF] border border-[#8757FF]/30">
                  Commerce AI
                </span>
              </div>
              <p className="text-[10px] text-[#9299B2] font-label font-medium hidden sm:block">
                The Future of Commerce is Intelligent
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#151A2B] text-white border border-[#8757FF]/40 shadow-xs'
                      : 'text-[#9299B2] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-[#43D9FF]' : 'text-[#9299B2]'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.isAi && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8757FF] animate-pulse"></span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#8757FF] to-[#43D9FF] rounded-full"></span>
                  )}
                </button>
              );
            })}

            {/* About Link */}
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#9299B2] hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#9299B2]" />
              <span>About</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Account / Login */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151A2B] border border-white/10 text-xs text-white">
                <User className="w-3.5 h-3.5 text-[#43D9FF]" />
                <span className="font-semibold truncate max-w-28">{currentUser.name}</span>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="text-[#9299B2] hover:text-rose-400 p-0.5 cursor-pointer ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#F5F6FF] hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#8757FF]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              aria-label={`Shopping Cart with ${cartItemCount} items`}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#151A2B] border border-white/10 hover:border-[#8757FF]/60 hover:bg-[#1C2236] rounded-xl transition-all shadow-xs group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#43D9FF] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline">Cart</span>
              <span
                data-testid="cart-badge-count"
                className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full font-mono transition-all ${
                  cartItemCount > 0
                    ? 'bg-gradient-to-r from-[#8757FF] to-[#6836F5] text-white shadow-xs glow-violet-refined'
                    : 'bg-white/10 text-[#9299B2]'
                }`}
              >
                {cartItemCount}
              </span>
            </button>

            {/* Prominent CTA */}
            <button
              onClick={() => setActiveTab('assistant')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white text-xs font-bold transition-all shadow-md glow-violet-refined cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#43D9FF]" />
              <span>Meet AI</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-xl focus:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-1 bg-[#101321] rounded-2xl p-3 mb-3 border border-white/5 animate-in fade-in duration-150">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#151A2B] text-white border border-[#8757FF]/40'
                      : 'text-[#9299B2] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#43D9FF]' : 'text-[#9299B2]'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  {link.isAi && (
                    <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[#8757FF]/20 text-[#43D9FF]">
                      Gemini
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenAbout();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-[#9299B2] hover:text-white bg-white/5 rounded-xl"
              >
                About Platform
              </button>

              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#8757FF] rounded-xl"
              >
                {currentUser ? currentUser.name : 'Sign In'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
