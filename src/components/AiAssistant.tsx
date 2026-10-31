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
  Plus
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
      text: "Hello! I am your PayPilot Commerce AI shopping assistant. I am grounded directly in our active catalogue and equipped with Google Search Grounding (gemini-3.8-flash) to provide real-world benchmark comparisons. How can I help you discover or assemble your cart today?",
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                PayPilot Shopping Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                <Globe className="w-3 h-3 text-emerald-600" />
                Google Search Grounding
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded in catalogue inventory with real-time web citations via gemini-3.8-flash.
            </p>
          </div>
        </div>

        {/* Safeguard Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>User-Approved Agentic Cart</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto bg-slate-100/60 rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const recommendedProducts = (msg.recommendedProductIds || [])
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean) as Product[];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-600">
                  {isUser ? 'You' : 'PayPilot AI Assistant'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {/* Google Search Grounding Sources (if assistant message and sources exist) */}
              {!isUser && lastGrounding && lastGrounding.sources.length > 0 && (
                <div className="mt-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 w-full text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 text-blue-800 font-semibold mb-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Search Grounding Citations (gemini-3.8-flash)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lastGrounding.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-700 hover:text-blue-900 hover:border-blue-300 text-[11px] font-medium transition-colors"
                      >
                        <span className="truncate max-w-44">{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-blue-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Product Cards Grid */}
              {!isUser && recommendedProducts.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-blue-600 uppercase">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {prod.name}
                        </h4>
                        <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                          ${prod.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => onOpenProductDetail(prod)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onAddToCart(prod)}
                          disabled={!prod.inStock}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comparison Trigger if requested */}
              {!isUser && msg.comparisonProductIds && msg.comparisonProductIds.length > 1 && (
                <div className="mt-3 w-full">
                  <button
                    onClick={() => onOpenCompareWithIds(msg.comparisonProductIds || [])}
                    className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Open Side-by-Side Comparison Matrix ({msg.comparisonProductIds.length} Products)
                  </button>
                </div>
              )}

              {/* Agentic Proposed Cart Review Card (Section 9) */}
              {!isUser && msg.proposedCart && msg.proposedCart.length > 0 && (
                <div className="mt-3 w-full bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-slate-800 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/80 mb-3">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>Proposed Cart Assembly (Awaiting Confirmation)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[10px] font-semibold">
                      Agentic Safeguard Active
                    </span>
                  </div>

                  <p className="text-slate-600 mb-3 text-[11px]">
                    The assistant has prepared this proposed bundle. Review items and quantities below before adding them to your active cart:
                  </p>

                  <div className="space-y-2 mb-4">
                    {msg.proposedCart.map((item, idx) => {
                      const prod = products.find((p) => p.id === item.productId);
                      if (!prod) return null;
                      return (
                        <div
                          key={idx}
                          className="bg-white p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <img src={prod.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                            <div>
                              <div className="font-semibold text-slate-900">{prod.name}</div>
                              <div className="text-[10px] text-slate-500">{item.reason}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">
                              {item.quantity} × ${prod.price.toFixed(2)}
                            </div>
                            <div className="text-[11px] text-blue-600 font-semibold">
                              ${(prod.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {msg.isCartApplied ? (
                    <div className="flex items-center gap-2 py-2 px-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Proposed items successfully added to your cart! You can review totals in Cart.
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyProposals(msg.id, msg.proposedCart || [])}
                      className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve &amp; Add Proposed Items to My Cart
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 max-w-xs shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Consulting catalogue &amp; Google Search Grounding...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
          Quick Prompts:
        </span>
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-[11px] font-medium text-slate-700 whitespace-nowrap shadow-2xs hover:border-blue-400 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything: 'Find headphones with long battery', 'Laptop under $800'..."
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 shadow-2xs placeholder:text-slate-400"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message to shopping assistant"
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
