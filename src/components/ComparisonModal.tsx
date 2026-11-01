import React from 'react';
import { X, Check, ShoppingBag, Trash2, SlidersHorizontal, Sparkles } from 'lucide-react';
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

  // AI-generated comparison summary based on actual specifications
  const comparisonSummary = React.useMemo(() => {
    if (products.length < 2) return null;
    const lowestPrice = [...products].sort((a, b) => a.price - b.price)[0];
    const highestRated = [...products].sort((a, b) => b.rating - a.rating)[0];

    return {
      bestValue: lowestPrice,
      topRated: highestRated,
      insight: `Comparing ${products.length} models across active catalogue attributes. ${highestRated.name} leads in customer reviews (★${highestRated.rating.toFixed(1)}), while ${lowestPrice.name} represents the best entry price at $${lowestPrice.price.toFixed(2)}.`,
    };
  }, [products]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#101321] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-white/10 my-8 text-left text-[#F5F6FF]">
        {/* Header */}
        <div className="p-6 bg-[#151A2B] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] flex items-center justify-center text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display text-white">
                SIDE-BY-SIDE PRODUCT COMPARISON
              </h2>
              <p className="text-xs text-[#9299B2] mt-0.5">
                Comparing {products.length} of 3 selected catalogue items. Missing specs are accurately shown as &quot;Not available&quot;.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI-Generated Comparison Summary Card */}
        {comparisonSummary && (
          <div className="m-6 p-4 rounded-2xl bg-gradient-to-r from-[#151A2B] to-[#101321] border border-[#8757FF]/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#43D9FF] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold font-display uppercase tracking-wider text-[#43D9FF]">
                AI Specification Synthesis
              </span>
              <p className="text-[#9299B2] leading-relaxed">
                {comparisonSummary.insight}
              </p>
            </div>
          </div>
        )}

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto p-6 pt-0">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-xs font-bold font-display uppercase tracking-wider text-[#9299B2] w-48 text-left bg-[#151A2B]/40">
                  Feature / Specification
                </th>
                {products.map((prod) => (
                  <th
                    key={prod.id}
                    className="p-4 w-72 align-top text-left border-l border-white/5 relative bg-[#151A2B]/20"
                  >
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onRemoveProduct(prod.id)}
                        className="self-end text-[#9299B2] hover:text-rose-400 p-1 cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={prod.imageUrl}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-white/10 shadow-md"
                      />
                      <div>
                        <span className="text-[10px] font-bold font-label text-[#43D9FF] uppercase">
                          {prod.category}
                        </span>
                        <h4 className="font-bold font-display text-white text-sm leading-snug line-clamp-2">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="mt-1">
                        <span className="text-lg font-black font-display text-white">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => onAddToCart(prod)}
                        disabled={!prod.inStock}
                        className="mt-2 w-full py-2 px-3 bg-[#8757FF] hover:bg-[#9569FF] text-white rounded-xl text-xs font-bold font-display transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#43D9FF]" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {specRows.map((spec) => (
                <tr key={spec.key} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 text-xs font-bold font-label text-[#9299B2] bg-[#151A2B]/40">
                    {spec.label}
                  </td>
                  {products.map((prod) => {
                    let value: string | undefined = undefined;
                    if (spec.key === 'category') value = prod.category;
                    else if (spec.key === 'price') value = `$${prod.price.toFixed(2)}`;
                    else if (prod.attributes && prod.attributes[spec.key]) {
                      value = String(prod.attributes[spec.key]);
                    }

                    return (
                      <td
                        key={prod.id}
                        className="p-3.5 text-xs text-white border-l border-white/5 font-mono"
                      >
                        {value ? (
                          <span className="font-medium">{value}</span>
                        ) : (
                          <span className="text-white/20 italic font-sans">Not available</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#151A2B] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold font-display rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Comparison Deck
          </button>
        </div>
      </div>
    </div>
  );
};
