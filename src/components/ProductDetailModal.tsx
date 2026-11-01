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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative h-72 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs">
              <img
                src={selectedImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-white/95 text-slate-800 rounded-md border border-slate-200 shadow-2xs">
                {product.category}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-blue-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Free shipping on eligible orders over $100</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified PayPal Sandbox test checkout</span>
              </div>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 text-sm mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {product.name}
              </h2>

              <div className="mt-3 text-2xl font-black text-slate-900">
                ${product.price.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400 uppercase">
                  {product.currency}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Attributes & Specifications Table */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Product Specifications
                </h4>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                      <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-semibold text-slate-800 text-right">{String(val)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Stock Availability</span>
                    <span className={`font-semibold ${product.stockQuantity > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} units available` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-semibold text-slate-800 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock || product.stockQuantity <= 0}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : !product.inStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white glow-violet active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#36D9F5]" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-slate-50/80 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Related in {product.category}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer flex items-center gap-3"
                >
                  <img src={rel.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-900 truncate">{rel.name}</p>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">${rel.price.toFixed(2)}</p>
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
