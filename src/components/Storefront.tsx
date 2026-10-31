import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Layers, 
  X, 
  ArrowUpDown, 
  CheckCircle2, 
  Bot,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

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

  const categories = [
    'All',
    'Electronics',
    'Home Office',
    'Audio & Wearables',
    'Accessories',
    'Lifestyle',
  ];

  // Filtering and sorting pipeline
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const brandMatch = p.attributes.brand && String(p.attributes.brand).toLowerCase().includes(q);
        return nameMatch || descMatch || catMatch || brandMatch;
      });
    }

    // Price range
    if (priceFilter === 'under100') {
      result = result.filter((p) => p.price < 100);
    } else if (priceFilter === '100to300') {
      result = result.filter((p) => p.price >= 100 && p.price <= 300);
    } else if (priceFilter === '300to600') {
      result = result.filter((p) => p.price > 300 && p.price <= 600);
    } else if (priceFilter === 'over600') {
      result = result.filter((p) => p.price > 600);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Title & Assistant Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Catalogue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified inventory, compare attributes, and prepare customer-approved orders.
          </p>
        </div>

        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 shadow-2xs transition-all"
        >
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Ask AI Shopping Assistant</span>
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs mb-8 space-y-4">
        {/* Search Bar + Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, product name, brand, or feature..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="featured">Featured / Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Price range:</span>
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'under100', label: 'Under $100' },
            { id: '100to300', label: '$100 – $300' },
            { id: '300to600', label: '$300 – $600' },
            { id: 'over600', label: '$600+' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setPriceFilter(range.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                priceFilter === range.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range.label}
            </button>
          ))}

          {(selectedCategory !== 'All' || searchQuery || priceFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setPriceFilter('all');
              }}
              className="ml-auto text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse p-4 flex flex-col justify-between">
              <div className="h-44 bg-slate-100 rounded-xl"></div>
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search terms, changing the category filter, or resetting price bounds.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setPriceFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isComparing = comparedProducts.some((p) => p.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenDetail={onOpenProductDetail}
                isComparing={isComparing}
                onToggleCompare={onToggleCompare}
              />
            );
          })}
        </div>
      )}

      {/* Floating Comparison Drawer when items are selected */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-2xl border border-slate-700 flex items-center gap-4 max-w-xl w-[90%]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
              {comparedProducts.length}
            </span>
            <span className="text-xs font-semibold">Comparing</span>
          </div>

          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {comparedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg text-xs truncate"
              >
                <img src={p.imageUrl} alt="" className="w-5 h-5 rounded object-cover" />
                <span className="truncate max-w-28 text-[11px]">{p.name}</span>
                <button
                  onClick={() => onToggleCompare(p)}
                  className="text-slate-400 hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompareModal}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Compare Specs
            </button>
            <button
              onClick={onClearCompare}
              className="text-slate-400 hover:text-white p-1"
              title="Clear comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
