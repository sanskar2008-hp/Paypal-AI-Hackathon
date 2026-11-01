import React from 'react';
import { Star, ShoppingBag, Eye, Check, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  isComparing: boolean;
  onToggleCompare: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  searchScore?: number;
  matchedFields?: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  isComparing,
  onToggleCompare,
  isWishlisted = false,
  onToggleWishlist,
  searchScore,
  matchedFields,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);
  const [localWishlisted, setLocalWishlisted] = React.useState(isWishlisted);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalWishlisted(!localWishlisted);
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div className="group bg-[#101321] rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-[#8757FF]/50 hover:shadow-2xl transition-all duration-250 flex flex-col justify-between relative text-left">
      {/* Top action icons: Compare & Wishlist */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          aria-label={localWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            localWishlisted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-[#080A12]/80 text-[#9299B2] hover:text-rose-400 hover:bg-[#080A12] border border-white/10'
          }`}
          title={localWishlisted ? 'Wishlisted' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${localWishlisted ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Compare Checkbox */}
        <label
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold font-label cursor-pointer transition-all shadow-xs ${
            isComparing
              ? 'bg-[#8757FF] text-white border-[#8757FF]'
              : 'bg-[#080A12]/80 text-[#F5F6FF] hover:bg-[#080A12] border-white/10'
          }`}
          title="Compare up to 3 products"
        >
          <input
            type="checkbox"
            checked={isComparing}
            onChange={() => onToggleCompare(product)}
            className="rounded text-[#8757FF] focus:ring-[#8757FF] w-3.5 h-3.5 cursor-pointer accent-[#8757FF]"
          />
          <span className="text-[11px] select-none">Compare</span>
        </label>
      </div>

      {/* Product Image Clickable to Open Details */}
      <div
        onClick={() => onOpenDetail(product)}
        className="relative h-60 bg-[#151A2B] overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
          loading="lazy"
        />
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-3 py-1 text-[10px] font-bold font-label bg-[#080A12]/85 backdrop-blur-md text-[#43D9FF] rounded-lg border border-white/10">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Rating & In-stock */}
          <div className="flex items-center justify-between text-xs text-[#9299B2] mb-2 font-label">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-[#9299B2]">({product.reviewCount})</span>
            </div>
            <span className={`text-[11px] font-bold ${
              product.stockQuantity > 0 ? 'text-[#38D99A]' : 'text-rose-400'
            }`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Fuzzy Search Match Indicator */}
          {searchScore !== undefined && searchScore < 100 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#43D9FF] bg-[#8757FF]/15 px-2.5 py-1 rounded-lg border border-[#8757FF]/30 w-fit mb-2">
              <Sparkles className="w-3 h-3 text-[#43D9FF]" />
              <span>{Math.min(99, Math.max(50, searchScore))}% Relevance</span>
              {matchedFields && matchedFields.length > 0 && (
                <span className="text-[#9299B2] font-normal capitalize">
                  · in {matchedFields.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
          )}

          <h3
            onClick={() => onOpenDetail(product)}
            className="text-base font-bold font-display text-white group-hover:text-[#43D9FF] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#9299B2] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs / Attributes */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px] text-[#9299B2]">
            {Object.entries(product.attributes)
              .slice(0, 3)
              .map(([key, val]) => (
                <span
                  key={key}
                  className="px-2.5 py-0.5 rounded-md bg-[#151A2B] text-white/70 font-mono text-[10px] border border-white/5"
                >
                  {String(val)}
                </span>
              ))}
          </div>
        </div>

        {/* Footer with Price and Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#9299B2] uppercase font-label tracking-wider block">
              PRICE
            </span>
            <span className="text-xl font-black font-display text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetail(product)}
              className="p-2 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="View product specifications"
              aria-label={`View details for ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`px-4 py-2.5 text-xs font-bold font-display rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                justAdded
                  ? 'bg-[#38D99A] text-[#080A12]'
                  : product.inStock
                  ? 'bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white glow-violet-refined'
                  : 'bg-white/10 text-[#9299B2] cursor-not-allowed'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#43D9FF]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
