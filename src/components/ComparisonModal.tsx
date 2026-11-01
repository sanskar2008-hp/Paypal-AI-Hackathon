import React from 'react';
import { X, Check, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  products,
  onClose,
  onAddToCart,
  onRemoveProduct,
  onClearAll,
}) => {
  if (!isOpen || products.length === 0) return null;

  // Standard comparison attributes list
  const specRows: { key: string; label: string }[] = [
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'brand', label: 'Brand' },
    { key: 'batteryLife', label: 'Battery Life' },
    { key: 'connectivity', label: 'Connectivity' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'weight', label: 'Weight' },
    { key: 'warranty', label: 'Warranty' },
    { key: 'color', label: 'Color' },
    { key: 'useCase', label: 'Primary Use Case' },
    { key: 'ancLevel', label: 'Noise Reduction' },
    { key: 'ram', label: 'RAM / Memory' },
    { key: 'storage', label: 'Storage' },
    { key: 'display', label: 'Display Specs' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Side-by-Side Product Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Comparing {products.length} of 3 selected catalogue products. Missing specifications are accurately shown as &quot;Not available&quot;.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-colors"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6 max-h-[75vh]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 bg-slate-100/60 font-semibold text-slate-600 text-xs uppercase tracking-wider w-1/4 rounded-tl-xl">
                  Attributes
                </th>
                {products.map((prod) => (
                  <th key={prod.id} className="p-4 align-top min-w-56">
                    <div className="flex flex-col items-start gap-2 relative">
                      <button
                        onClick={() => onRemoveProduct(prod.id)}
                        className="absolute top-0 right-0 p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Remove from compare"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={prod.imageUrl}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <span className="text-[10px] font-semibold text-blue-600 uppercase">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="mt-1">
                        <span className="text-base font-extrabold text-slate-900">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => onAddToCart(prod)}
                        disabled={!prod.inStock}
                        className="mt-2 w-full py-2 px-3 bg-[#7657FF] hover:bg-[#6343F5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {specRows.map((spec) => (
                <tr key={spec.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 text-xs font-semibold text-slate-600 bg-slate-50/40">
                    {spec.label}
                  </td>
                  {products.map((prod) => {
                    let value: string | undefined = undefined;
                    if (spec.key === 'category') value = prod.category;
                    else if (spec.key === 'price') value = `$${prod.price.toFixed(2)} ${prod.currency}`;
                    else if (prod.attributes && prod.attributes[spec.key] !== undefined) {
                      value = String(prod.attributes[spec.key]);
                    }

                    return (
                      <td key={prod.id} className="p-3 text-xs text-slate-800">
                        {value && value.trim() ? (
                          <span className="font-medium text-slate-900">{value}</span>
                        ) : (
                          <span className="text-slate-400 italic">Not available</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
