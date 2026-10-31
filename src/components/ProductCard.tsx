import React from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  isComparing: boolean;
  onToggleCompare: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  isComparing,
  onToggleCompare,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col relative">
      {/* Compare Checkbox pill top right */}
      <label
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-2xs hover:bg-white text-xs font-medium cursor-pointer transition-colors"
        title="Compare up to 3 products"
      >
        <input
          type="checkbox"
          checked={isComparing}
          onChange={() => onToggleCompare(product)}
          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
        />
        <span className="text-[11px] text-slate-700 select-none">Compare</span>
      </label>

      {/* Product Image Clickable to Open Details */}
      <div
        onClick={() => onOpenDetail(product)}
        className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 rounded border border-slate-200">
            {product.category}
          </span>
          {product.isDemoProduct && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-blue-50 text-blue-700 rounded border border-blue-200 uppercase">
              Demo
            </span>
          )}
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
            <span className="ml-auto text-[11px] font-medium text-emerald-600">
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs / Attributes */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.entries(product.attributes)
              .slice(0, 3)
              .map(([key, val]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded font-medium"
                >
                  {String(val)}
                </span>
              ))}
          </div>
        </div>

        {/* Pricing and Actions Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Price
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Quick inspect"
              aria-label={`View details for ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock || product.stockQuantity <= 0}
              aria-label={`Add ${product.name} to cart`}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : !product.inStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
