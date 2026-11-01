import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Layers, 
  X, 
  ArrowUpDown, 
  CheckCircle2, 
  Bot,
  Sparkles,
  Heart,
  ArrowRight,
  Filter,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { fuzzySearchProducts, ScoredProduct } from '../utils/fuzzySearch';

interface StorefrontProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  comparedProducts: Product[];
  onToggleCompare: (product: Product) => void;
  onOpenCompareModal: () => void;
  onClearCompare: () => void;
  onOpenAssistant: () => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  isLoading,
  onAddToCart,
  onOpenProductDetail,
  comparedProducts,
  onToggleCompare,
  onOpenCompareModal,
  onClearCompare,
  onOpenAssistant,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [priceFilter, setPriceFilter] = React.useState<'all' | 'under100' | '100to300' | '300to600' | 'over600'>('all');
  const [sortBy, setSortBy] = React.useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [wishlistIds, setWishlistIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('paypilot_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showWishlistOnly, setShowWishlistOnly] = React.useState(false);

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id];
      try {
        localStorage.setItem('paypilot_wishlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const categories = [
    'All',
    'Electronics',
    'Home Office',
    'Audio & Wearables',
    'Accessories',
    'Lifestyle',
  ];

  // Quick typo/fuzzy examples for testing
  const fuzzyQuickTests = [
    { label: 'aerobok', desc: 'Typo: AeroBook' },
    { label: 'hdphn', desc: 'Subsequence: Headphones' },
    { label: 'ergowork', desc: 'Brand: ErgoWorks' },
    { label: 'nois', desc: 'Spec: Noise Cancelling' },
  ];

  // Real-time fuzzy filtering & scoring pipeline
  const filteredProducts: ScoredProduct[] = React.useMemo(() => {
    let pool = [...products];

    // Wishlist filter
    if (showWishlistOnly) {
      pool = pool.filter((p) => wishlistIds.includes(p.id));
    }

    // Category filter
    if (selectedCategory !== 'All') {
      pool = pool.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    if (priceFilter === 'under100') {
      pool = pool.filter((p) => p.price < 100);
    } else if (priceFilter === '100to300') {
      pool = pool.filter((p) => p.price >= 100 && p.price <= 300);
    } else if (priceFilter === '300to600') {
      pool = pool.filter((p) => p.price > 300 && p.price <= 600);
    } else if (priceFilter === 'over600') {
      pool = pool.filter((p) => p.price > 600);
    }

    // Advanced real-time fuzzy matching algorithm
    const hasSearch = Boolean(searchQuery.trim());
    let scoredList: ScoredProduct[] = [];

    if (hasSearch) {
      scoredList = fuzzySearchProducts(pool, searchQuery);
    } else {
      scoredList = pool.map((p) => ({
        ...p,
        searchScore: 100,
        matchedFields: [],
      }));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      scoredList.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      scoredList.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      scoredList.sort((a, b) => b.rating - a.rating);
    } else if (hasSearch && sortBy === 'featured') {
      scoredList.sort((a, b) => b.searchScore - a.searchScore);
    }

    return scoredList;
  }, [products, selectedCategory, priceFilter, searchQuery, sortBy, showWishlistOnly, wishlistIds]);

  const isFuzzyActive = Boolean(searchQuery.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 text-left bg-[#080A12]">
      {/* Top Banner: AI Discovery Callout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101321] via-[#151A2B] to-[#101321] p-8 text-white border border-[#8757FF]/35 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-label uppercase tracking-widest text-[#43D9FF]">
                INTELLIGENT CATALOGUE DISCOVERY
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#9299B2]">Grounded in Active Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              VERIFIED HARDWARE &amp; LIFESTYLE
            </h1>
            <p className="text-xs sm:text-sm text-[#9299B2] max-w-xl">
              Type naturally in the search bar below to experience real-time fuzzy matching with typo tolerance and multi-field scoring.
            </p>
          </div>

          <button
            onClick={onOpenAssistant}
            className="px-6 py-3.5 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white text-xs font-bold font-display rounded-2xl shadow-xl glow-violet-refined transition-all flex items-center gap-2.5 shrink-0 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#43D9FF]" />
            <span>ASK AI ASSISTANT</span>
          </button>
        </div>
      </div>

      {/* FILTER & FUZZY SEARCH CONTROL BAR */}
      <div className="space-y-4 bg-[#101321] p-6 rounded-3xl border border-white/10 shadow-xl">
        {/* Search bar & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Real-Time Fuzzy Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9299B2] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Fuzzy search by name, brand, spec, or typo (e.g. 'aerobok', 'hdphn', 'ergowork')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-[#151A2B] border border-white/10 focus:border-[#8757FF] focus:outline-hidden focus:ring-1 focus:ring-[#8757FF] transition-all text-white placeholder:text-white/30 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9299B2] hover:text-white p-1 cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price & Sort Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="px-3.5 py-3 text-xs font-bold font-label rounded-2xl bg-[#151A2B] border border-white/10 text-white focus:outline-hidden focus:border-[#8757FF] cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="under100">Under $100</option>
              <option value="100to300">$100 – $300</option>
              <option value="300to600">$300 – $600</option>
              <option value="over600">Over $600</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-3 text-xs font-bold font-label rounded-2xl bg-[#151A2B] border border-white/10 text-white focus:outline-hidden focus:border-[#8757FF] cursor-pointer"
            >
              <option value="featured">
                {isFuzzyActive ? 'Sort: Fuzzy Relevance' : 'Sort: Featured'}
              </option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`px-3.5 py-3 text-xs font-bold font-label rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                showWishlistOnly
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-[#151A2B] text-[#9299B2] border-white/10 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-rose-400' : ''}`} />
              <span>Saved ({wishlistIds.length})</span>
            </button>
          </div>
        </div>

        {/* Real-Time Algorithm Status Bar & Quick Typo Tests */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs border-t border-white/5">
          <div className="flex items-center gap-2">
            {isFuzzyActive ? (
              <div className="flex items-center gap-2 text-[#43D9FF] font-semibold bg-[#8757FF]/15 px-3 py-1 rounded-xl border border-[#8757FF]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43D9FF] animate-pulse"></span>
                <span>Fuzzy Match: {filteredProducts.length} results</span>
                <span className="text-[#9299B2] font-normal">
                  (Damerau-Levenshtein &amp; Subsequence Scoring)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#9299B2]">
                <Zap className="w-3.5 h-3.5 text-[#8757FF]" />
                <span className="text-[11px]">Real-time fuzzy search with typo tolerance active</span>
              </div>
            )}
          </div>

          {/* Quick test buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-[#9299B2] shrink-0">Try typing:</span>
            {fuzzyQuickTests.map((t) => (
              <button
                key={t.label}
                onClick={() => setSearchQuery(t.label)}
                className="px-2.5 py-0.5 rounded-lg bg-[#151A2B] hover:bg-[#8757FF]/20 text-[#9299B2] hover:text-[#43D9FF] text-[10px] font-mono border border-white/10 transition-colors shrink-0 cursor-pointer"
                title={t.desc}
              >
                "{t.label}"
              </button>
            ))}
          </div>
        </div>

        {/* Category Segmented Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-white/5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold font-label rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8757FF] text-white shadow-md glow-violet-refined'
                    : 'bg-[#151A2B] text-[#9299B2] hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FLOATING COMPARISON DRAWER BAR */}
      {comparedProducts.length > 0 && (
        <div className="sticky top-20 z-30 p-4 rounded-2xl bg-[#151A2B] text-white border border-[#8757FF]/40 shadow-2xl flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-display text-[#43D9FF]">
              COMPARISON DECK:
            </span>
            <div className="flex items-center gap-2">
              {comparedProducts.map((p) => (
                <span
                  key={p.id}
                  className="text-xs font-medium bg-[#101321] text-[#F5F6FF] px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5"
                >
                  <span className="truncate max-w-28">{p.name}</span>
                  <button
                    onClick={() => onToggleCompare(p)}
                    className="text-[#9299B2] hover:text-white"
                    aria-label={`Remove ${p.name} from comparison`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="text-xs text-[#9299B2] hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={onOpenCompareModal}
              className="px-4 py-2 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white text-xs font-bold font-display rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>COMPARE ({comparedProducts.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#43D9FF]" />
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-[#101321] rounded-3xl border border-white/5 p-4 h-96 animate-pulse space-y-4"
            >
              <div className="h-56 bg-white/5 rounded-2xl"></div>
              <div className="h-4 bg-white/5 rounded w-3/4"></div>
              <div className="h-3 bg-white/5 rounded w-1/2"></div>
              <div className="h-8 bg-white/5 rounded mt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#101321] rounded-3xl border border-white/10 p-16 text-center shadow-2xl space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 text-[#9299B2] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-display text-white">
            No products match your fuzzy query "{searchQuery}"
          </h3>
          <p className="text-xs text-[#9299B2] max-w-sm mx-auto">
            Try adjusting your search terms, changing the category, or clearing active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setPriceFilter('all');
              setShowWishlistOnly(false);
            }}
            className="px-5 py-2.5 bg-[#8757FF] hover:bg-[#9569FF] text-white text-xs font-bold font-display rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters &amp; Query
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetail={onOpenProductDetail}
              isComparing={comparedProducts.some((p) => p.id === product.id)}
              onToggleCompare={onToggleCompare}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={toggleWishlist}
              searchScore={product.searchScore}
              matchedFields={product.matchedFields}
            />
          ))}
        </div>
      )}
    </div>
  );
};
