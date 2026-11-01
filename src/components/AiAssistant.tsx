import React from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingBag, 
  SlidersHorizontal, 
  ShieldCheck, 
  RefreshCw,
  Plus,
  ArrowRight,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { ChatMessage, Product, ProposedCartItem } from '../types';

interface AiAssistantProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onApplyProposedCart: (proposals: ProposedCartItem[]) => void;
  onOpenCompareWithIds: (productIds: string[]) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  products,
  onAddToCart,
  onApplyProposedCart,
  onOpenCompareWithIds,
  onOpenProductDetail,
}) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello! I am your PayPilot Commerce AI shopping assistant. Grounded directly in our active inventory and backed by Google Search Grounding (gemini-3.8-flash), I can recommend hardware, compare technical specs, and prepare custom bundles for your approval.\n\nHow can I help you find or compare products today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastGrounding, setLastGrounding] = React.useState<{
    active: boolean;
    model: string;
    sources: { title: string; uri: string }[];
    queries: string[];
  } | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const starterPrompts = [
    'Find a laptop for college under $1000',
    'Compare AuraSound Pro and PulseFlow headphones',
    'Show me ergonomic essentials for a home office',
    'Help me prepare a cart for a complete remote desk setup',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error('AI assistant response error');
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here are the recommended items based on your search.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: data.recommendedProductIds || [],
        comparisonProductIds: data.comparisonProductIds || [],
        proposedCart: data.proposedCart || [],
        isCartApplied: false,
      };

      if (data.searchGrounding) {
        setLastGrounding(data.searchGrounding);
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an error retrieving data from the catalogue service. Please try again or browse products directly in the catalogue.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyProposals = (msgId: string, proposals: ProposedCartItem[]) => {
    onApplyProposedCart(proposals);
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isCartApplied: true } : m))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      {/* Header Info Banner */}
      <div className="bg-[#101426] rounded-2xl border border-[#7657FF]/35 p-4 sm:p-5 shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7657FF] to-[#36D9F5] text-white flex items-center justify-center shadow-md font-bold text-lg shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                PayPilot AI Shopping Assistant
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#36D9F5]/20 text-[#36D9F5] text-[11px] font-semibold border border-[#36D9F5]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36D9F5] animate-pulse"></span>
                Online • Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Grounded in catalogue inventory with real-time web citations &amp; customer-confirmed cart proposals.
            </p>
          </div>
        </div>

        {/* Safeguard Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#161B33] border border-[#7657FF]/30 text-xs text-slate-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#36D9F5]" />
          <span>Agentic Safeguards Active</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 sm:p-6 space-y-6 shadow-2xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const recommendedProducts = (msg.recommendedProductIds || [])
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean) as Product[];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1.5 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-700">
                  {isUser ? 'You' : 'PayPilot Assistant'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-[#7657FF] to-[#6343F5] text-white rounded-br-xs shadow-md glow-violet'
                    : 'bg-white text-[#101426] rounded-bl-xs border border-slate-200/90 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line text-left">{msg.text}</p>
              </div>

              {/* Google Search Grounding Sources */}
              {!isUser && lastGrounding && lastGrounding.sources.length > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-200/90 rounded-xl p-3 w-full text-xs text-slate-700 text-left">
                  <div className="flex items-center gap-1.5 text-[#7657FF] font-bold mb-2">
                    <Globe className="w-3.5 h-3.5 text-[#36D9F5]" />
                    <span>Search Grounding Citations (Google Search Grounding)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lastGrounding.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#7657FF] hover:border-[#7657FF]/40 text-[11px] font-medium transition-colors"
                      >
                        <span className="truncate max-w-48">{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Product Cards Grid */}
              {!isUser && recommendedProducts.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs flex items-center justify-between gap-3 hover:border-[#7657FF]/40 hover:shadow-xs transition-all"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#7657FF] uppercase tracking-wider block">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {prod.name}
                        </h4>
                        <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                          ${prod.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => onOpenProductDetail(prod)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(prod)}
                          className="px-2.5 py-1 bg-[#7657FF] hover:bg-[#6343F5] text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Multi-Product Comparison Matrix Trigger */}
              {!isUser && msg.comparisonProductIds && msg.comparisonProductIds.length > 1 && (
                <div className="mt-3 p-3.5 bg-purple-50/70 border border-purple-200/70 rounded-xl w-full flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#7657FF]" />
                    <span className="text-xs font-bold text-slate-800">
                      Product Comparison Matrix Ready ({msg.comparisonProductIds.length} items)
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenCompareWithIds(msg.comparisonProductIds || [])}
                    className="px-3 py-1.5 bg-[#7657FF] hover:bg-[#6343F5] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Agentic Safeguard Proposed Cart Review Card */}
              {!isUser && msg.proposedCart && msg.proposedCart.length > 0 && (
                <div className="mt-3 bg-white border border-[#7657FF]/40 rounded-xl p-4 w-full shadow-md text-left space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#7657FF] animate-pulse"></span>
                      <h4 className="text-xs font-bold text-[#101426]">
                        Proposed Cart Assembly (Awaiting Confirmation)
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#7657FF]/10 text-[#7657FF] rounded-md border border-[#7657FF]/20">
                      Agentic Safeguard Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    The assistant has prepared this bundle based on your constraints. Review items below before adding them to your active cart:
                  </p>

                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    {msg.proposedCart.map((item, idx) => {
                      const prod = products.find((p) => p.id === item.productId);
                      if (!prod) return null;
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div>
                            <span className="font-bold text-slate-900">{prod.name}</span>
                            <span className="text-slate-500 text-[11px] ml-2">
                              {item.reason}
                            </span>
                          </div>
                          <div className="text-right font-mono font-bold text-slate-900">
                            {item.quantity} × ${prod.price.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {msg.isCartApplied ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Proposed items successfully added to your cart!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyProposals(msg.id, msg.proposedCart || [])}
                      className="w-full py-2.5 bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#36D9F5]" />
                      <span>Approve &amp; Add Proposed Items to My Cart</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pl-2">
            <div className="w-7 h-7 rounded-lg bg-[#7657FF]/20 text-[#7657FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin text-[#7657FF]" />
            </div>
            <span className="font-semibold text-slate-700">
              PayPilot AI is analyzing catalogue and searching web benchmarks...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-left">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">
          Quick Prompts:
        </span>
        {starterPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 hover:text-[#7657FF] border border-slate-200 rounded-xl whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm focus-within:border-[#7657FF] focus-within:ring-2 focus-within:ring-[#7657FF]/20 transition-all"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask PayPilot Assistant to find products, compare specs, or build your cart..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-hidden text-slate-900 placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-2.5 bg-gradient-to-r from-[#7657FF] to-[#6343F5] hover:from-[#6947FF] hover:to-[#5533F0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
