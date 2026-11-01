import React from 'react';
import { Star, ShoppingBag, Eye, Check, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  isComparing: boolean;
  onToggleCompare: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  isComparing,
  onToggleCompare,
  isWishlisted = false,
  onToggleWishlist,
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
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:border-[#7657FF]/40 hover:shadow-xl transition-all duration-200 flex flex-col relative text-left">
      {/* Top action icons: Compare & Wishlist */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          aria-label={localWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`p-1.5 rounded-xl backdrop-blur-md transition-all shadow-2xs ${
            localWishlisted
              ? 'bg-rose-50 text-rose-500 border border-rose-200'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200/80'
          }`}
          title={localWishlisted ? 'Wishlisted' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${localWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Compare Checkbox */}
        <label
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md border text-xs font-medium cursor-pointer transition-colors shadow-2xs ${
            isComparing
              ? 'bg-[#7657FF] text-white border-[#7657FF]'
              : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200/80'
          }`}
          title="Compare up to 3 products"
        >
          <input
            type="checkbox"
            checked={isComparing}
            onChange={() => onToggleCompare(product)}
            className="rounded text-[#7657FF] focus:ring-[#7657FF] w-3.5 h-3.5 cursor-pointer accent-[#7657FF]"
          />
          <span className="text-[11px] select-none font-semibold">Compare</span>
        </label>
      </div>

      {/* Product Image Clickable to Open Details */}
      <div
        onClick={() => onOpenDetail(product)}
        className="relative h-56 bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#101426]/85 backdrop-blur-md text-white rounded-lg">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Rating & In-stock */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
            <span className={`text-[11px] font-semibold ${
              product.stockQuantity > 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className="text-base font-bold text-[#101426] group-hover:text-[#7657FF] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs / Attributes (Clean unboxed inline tags) */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
            {Object.entries(product.attributes)
              .slice(0, 3)
              .map(([key, val]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]"
                >
                  {String(val)}
                </span>
              ))}
          </div>
        </div>

        {/* Footer with Price and Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Price
            </span>
            <span className="text-lg font-black text-[#101426]">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenDetail(product)}
              className="p-2 text-slate-500 hover:text-[#101426] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="View product specifications"
              aria-label={`View details for ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : product.inStock
                  ? 'bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
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
