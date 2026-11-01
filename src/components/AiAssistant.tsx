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
      text: "Hello! I'm your PayPilot AI shopping assistant. What are you looking for today?\n\nI am grounded in our verified catalogue and backed by Google Search Grounding to evaluate real-world specifications, compare hardware side-by-side, and prepare custom cart assemblies for your approval.",
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
    'Find the best product for me.',
    'Compare two products.',
    'Recommend products within my budget.',
    'Explain product features.',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col h-[calc(100vh-8.5rem)] space-y-4 bg-[#080A12]">
      {/* Header Info Banner */}
      <div className="bg-[#101321] rounded-3xl border border-[#8757FF]/35 p-5 shadow-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] text-white flex items-center justify-center shadow-lg font-black font-display text-lg shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display text-white tracking-tight">
                PayPilot Conversational Workspace
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8757FF]/20 text-[#43D9FF] text-[11px] font-bold font-label border border-[#8757FF]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43D9FF] animate-pulse"></span>
                Gemini 3.8 Flash • Search Grounded
              </span>
            </div>
            <p className="text-xs text-[#9299B2] mt-0.5">
              Natural language recommendations grounded in active catalogue stock with zero unauthorized cart charges.
            </p>
          </div>
        </div>

        {/* Safeguard Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#151A2B] border border-white/10 text-xs text-[#43D9FF] font-label font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#43D9FF]" />
          <span>Agentic Safeguards Active</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto bg-[#101321]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-7 space-y-6 shadow-2xl">
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
              <div className="flex items-center gap-2 mb-1.5 text-[11px] text-[#9299B2] font-label">
                <span className="font-bold text-white">
                  {isUser ? 'You' : 'PayPilot AI Shopper'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-5 rounded-3xl text-sm leading-relaxed text-left ${
                  isUser
                    ? 'bg-gradient-to-r from-[#8757FF] to-[#6836F5] text-white rounded-br-xs shadow-lg glow-violet-refined font-medium'
                    : 'bg-[#151A2B] text-[#F5F6FF] rounded-bl-xs border border-white/10 shadow-xl'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {/* Google Search Grounding Sources */}
              {!isUser && lastGrounding && lastGrounding.sources.length > 0 && (
                <div className="mt-3 bg-[#151A2B] border border-white/10 rounded-2xl p-4 w-full text-xs text-[#F5F6FF] text-left">
                  <div className="flex items-center gap-1.5 text-[#43D9FF] font-bold font-label mb-2">
                    <Globe className="w-4 h-4 text-[#43D9FF]" />
                    <span>Search Grounding Citations (Google Search Grounding)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lastGrounding.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101321] border border-white/10 text-white/80 hover:text-white hover:border-[#8757FF]/50 text-[11px] font-medium transition-colors"
                      >
                        <span className="truncate max-w-52">{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-[#43D9FF]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Product Cards Grid */}
              {!isUser && recommendedProducts.length > 0 && (
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#151A2B] rounded-2xl border border-white/10 p-3.5 shadow-xl flex items-center justify-between gap-3 hover:border-[#8757FF]/40 transition-all"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold font-label text-[#43D9FF] uppercase tracking-wider block">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-bold font-display text-white truncate">
                          {prod.name}
                        </h4>
                        <div className="text-xs font-black font-display text-white mt-0.5">
                          ${prod.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => onOpenProductDetail(prod)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#F5F6FF] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(prod)}
                          className="px-2.5 py-1 bg-[#8757FF] hover:bg-[#9569FF] text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-[#43D9FF]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Multi-Product Comparison Matrix Trigger */}
              {!isUser && msg.comparisonProductIds && msg.comparisonProductIds.length > 1 && (
                <div className="mt-3.5 p-4 bg-[#151A2B] border border-[#8757FF]/40 rounded-2xl w-full flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#43D9FF]" />
                    <span className="text-xs font-bold font-display text-white">
                      Product Comparison Matrix Ready ({msg.comparisonProductIds.length} items)
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenCompareWithIds(msg.comparisonProductIds || [])}
                    className="px-4 py-2 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white rounded-xl text-xs font-bold font-display transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Agentic Safeguard Proposed Cart Review Card */}
              {!isUser && msg.proposedCart && msg.proposedCart.length > 0 && (
                <div className="mt-3.5 bg-[#151A2B] border border-[#8757FF]/50 rounded-2xl p-5 w-full shadow-2xl text-left space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#43D9FF] animate-pulse"></span>
                      <h4 className="text-xs font-bold font-display text-white">
                        Proposed Cart Assembly (Awaiting Confirmation)
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold font-label bg-[#8757FF]/20 text-[#43D9FF] rounded-md border border-[#8757FF]/30">
                      Agentic Safeguard Active
                    </span>
                  </div>

                  <p className="text-xs text-[#9299B2]">
                    The assistant has prepared this bundle based on your constraints. Review items below before adding them to your active cart:
                  </p>

                  <div className="space-y-2 bg-[#101321] p-3 rounded-xl border border-white/5">
                    {msg.proposedCart.map((item, idx) => {
                      const prod = products.find((p) => p.id === item.productId);
                      if (!prod) return null;
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div>
                            <span className="font-bold text-white">{prod.name}</span>
                            <span className="text-[#9299B2] text-[11px] ml-2">
                              {item.reason}
                            </span>
                          </div>
                          <div className="text-right font-mono font-bold text-white">
                            {item.quantity} × ${prod.price.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {msg.isCartApplied ? (
                    <div className="flex items-center gap-2 text-xs text-[#38D99A] font-bold bg-[#38D99A]/10 px-4 py-2.5 rounded-xl border border-[#38D99A]/30">
                      <Check className="w-4 h-4 text-[#38D99A]" />
                      <span>Proposed items successfully added to your cart!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyProposals(msg.id, msg.proposedCart || [])}
                      className="w-full py-3 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white text-xs font-bold font-display rounded-xl shadow-md glow-violet-refined transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#43D9FF]" />
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
          <div className="flex items-center gap-2 text-xs text-[#9299B2] pl-2">
            <div className="w-7 h-7 rounded-xl bg-[#8757FF]/20 text-[#43D9FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <span className="font-semibold text-white">
              PayPilot AI is analyzing catalogue and searching web benchmarks...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-left">
        <span className="text-[11px] font-bold font-label text-[#9299B2] shrink-0">
          Suggested:
        </span>
        {starterPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#101321] hover:bg-[#151A2B] text-[#F5F6FF] hover:text-[#43D9FF] border border-white/10 rounded-xl whitespace-nowrap transition-all shadow-xs shrink-0 cursor-pointer"
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
        className="flex items-center gap-2 bg-[#101321] p-2 rounded-2xl border border-white/10 shadow-xl focus-within:border-[#8757FF] transition-all"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask PayPilot Assistant to find products, compare specs, or build your cart..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 text-xs sm:text-sm bg-transparent focus:outline-hidden text-white placeholder:text-white/30 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] disabled:bg-white/5 disabled:text-[#9299B2] text-white font-bold font-display rounded-xl text-xs transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 text-[#43D9FF]" />
        </button>
      </form>
    </div>
  );
};
