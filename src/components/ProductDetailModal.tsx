import React from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check, Truck } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  relatedProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  relatedProducts,
  onSelectRelated,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#101321] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/10 text-left text-[#F5F6FF] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="p-6 bg-[#080A12] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative h-72 rounded-2xl overflow-hidden bg-[#151A2B] border border-white/10 shadow-xl">
              <img
                src={selectedImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold font-label bg-[#080A12]/90 text-[#43D9FF] rounded-lg border border-white/10 shadow-xs">
                {product.category}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-[#8757FF] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#9299B2] space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <Truck className="w-3.5 h-3.5 text-[#43D9FF]" />
                <span>Free shipping on eligible orders over $100</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38D99A]" />
                <span>Verified PayPal Developer Sandbox checkout</span>
              </div>
            </div>
          </div>

          {/* Details & Specifications */}
          <div className="p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-sm mb-2">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                <span className="text-[#9299B2]">({product.reviewCount} customer reviews)</span>
              </div>

              <h2 className="text-2xl font-black font-display text-white tracking-tight">
                {product.name}
              </h2>

              <div className="mt-3 text-3xl font-black font-display text-white">
                ${product.price.toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#9299B2] font-mono uppercase">
                  {product.currency}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-[#9299B2] leading-relaxed">
                {product.description}
              </p>

              {/* Attributes & Specifications Table */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white mb-2.5">
                  PRODUCT SPECIFICATIONS
                </h4>
                <div className="bg-[#151A2B] rounded-2xl p-4 border border-white/10 text-xs space-y-2">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                      <span className="text-[#9299B2] capitalize font-label">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold font-mono text-white text-right">{String(val)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1">
                    <span className="text-[#9299B2] font-label">Stock Availability</span>
                    <span className={`font-bold ${product.stockQuantity > 0 ? 'text-[#38D99A]' : 'text-rose-400'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} units in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
              <div className="flex items-center border border-white/10 rounded-2xl overflow-hidden bg-[#151A2B]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[#9299B2] hover:text-white font-bold text-sm cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 font-mono font-bold text-sm text-white select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                  className="px-3 py-2 text-[#9299B2] hover:text-white font-bold text-sm cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold font-display text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                  added
                    ? 'bg-[#38D99A] text-[#080A12]'
                    : product.inStock
                    ? 'bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white glow-violet-refined'
                    : 'bg-white/10 text-[#9299B2] cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#080A12]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#43D9FF]" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-[#080A12] border-t border-white/10">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white mb-3">
              RELATED IN {product.category.toUpperCase()}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedProducts.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="p-3 bg-[#151A2B] rounded-2xl border border-white/5 hover:border-[#8757FF]/40 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={rel.imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{rel.name}</h5>
                    <span className="text-xs font-mono font-bold text-[#43D9FF]">
                      ${rel.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
