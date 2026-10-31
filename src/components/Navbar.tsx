import React from 'react';
import { 
  Bot, 
  ShoppingBag, 
  Layers, 
  LayoutDashboard, 
  History, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export type ActiveTab = 'landing' | 'storefront' | 'assistant' | 'orders' | 'seller';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartItemCount: number;
  openCart: () => void;
  isPayPalConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItemCount,
  openCart,
  isPayPalConfigured,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Layers className="w-4 h-4" /> },
    { id: 'storefront', label: 'Explore Products', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'assistant', label: 'AI Shopping Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'orders', label: 'Order History', icon: <History className="w-4 h-4" /> },
    { id: 'seller', label: 'Seller Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Sandbox Test Mode Notice Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 font-mono flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 text-[11px] font-semibold tracking-wide uppercase border border-blue-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            PayPal Sandbox — Test Mode
          </span>
          <span className="hidden sm:inline text-slate-400">
            Official test environment: All transactions are processed safely without real financial charges.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden focus:ring-2 focus:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold text-lg tracking-tight">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  PayPilot
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">
                  AI Commerce
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Agentic Shopping & Seller Insights
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
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {link.id === 'assistant' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Cart Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={openCart}
              aria-label={`Shopping Cart with ${cartItemCount} items`}
              className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-colors shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Cart</span>
              <span
                data-testid="cart-badge-count"
                className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                  cartItemCount > 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cartItemCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === link.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
