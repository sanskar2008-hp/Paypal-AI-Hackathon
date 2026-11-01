import React from 'react';
import { X, Sparkles, ShieldCheck, Cpu, CreditCard, TableProperties, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
  onLaunchAssistant: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onExplore,
  onLaunchAssistant,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#101321] border border-[#8757FF]/30 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl text-[#F5F6FF] my-8 text-left">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between relative bg-[#151A2B]/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold font-label uppercase tracking-widest text-[#43D9FF]">
                Platform Architecture &amp; Vision
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] text-[#38D99A] font-semibold">Production-Grade Prototype</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              About PayPilot Commerce AI
            </h2>
            <p className="text-xs sm:text-sm text-[#9299B2] mt-1 max-w-xl">
              "THE FUTURE OF COMMERCE IS INTELLIGENT." Engineered to bridge natural language discovery with server-authoritative fintech execution.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close about modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Mission statement */}
          <div className="p-5 rounded-2xl bg-[#151A2B] border border-white/5 space-y-2">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[#43D9FF]">
              Why PayPilot Was Built
            </h3>
            <p className="text-xs sm:text-sm text-[#9299B2] leading-relaxed">
              Traditional e-commerce overwhelms buyers with thousands of disjointed filter menus, while generic conversational agents hallucinate specifications and attempt unapproved credit card charges. PayPilot solves both challenges by pairing <strong className="text-white font-semibold">Gemini 3.8 Flash with Google Search Grounding</strong> for live benchmark citations, guarded by a strict <strong className="text-white font-semibold">Human-in-the-Loop Agentic Safeguard</strong> that requires explicit customer approval before cart modifications.
            </p>
          </div>

          {/* 4 Architectural Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#151A2B] border border-white/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#8757FF]/15 text-[#8757FF] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-display text-white">
                Grounded Intelligence Layer
              </h4>
              <p className="text-xs text-[#9299B2] leading-relaxed">
                Connects directly to verified catalogue stock and real-time Google search indices to cite actual specs, battery benchmarks, and independent reviews.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151A2B] border border-white/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#43D9FF]/15 text-[#43D9FF] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-display text-white">
                Zero Blind AI Charges
              </h4>
              <p className="text-xs text-[#9299B2] leading-relaxed">
                The assistant prepares recommended bundles and compares items, but requires explicit customer authorization before any item enters the checkout pipeline.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151A2B] border border-white/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#38D99A]/15 text-[#38D99A] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-display text-white">
                PayPal Developer Platform Sandbox
              </h4>
              <p className="text-xs text-[#9299B2] leading-relaxed">
                Server-authoritative order creation and capture token verification. Line-item prices, taxes, and shipping are computed on the backend to prevent client tampering.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151A2B] border border-white/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#8757FF]/15 text-[#8757FF] flex items-center justify-center">
                <TableProperties className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-display text-white">
                AG Grid &amp; Real-Time Logistics
              </h4>
              <p className="text-xs text-[#9299B2] leading-relaxed">
                Enterprise AG Grid data tables for merchants and multi-stage progressive shipping tracks with carrier updates for customers.
              </p>
            </div>
          </div>

          {/* Test Mode Designation */}
          <div className="p-4 rounded-xl bg-[#1C2236]/80 border border-[#8757FF]/25 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#43D9FF] animate-pulse shrink-0"></span>
            <div className="text-xs">
              <span className="font-bold text-white">PayPal Sandbox Safe Testing:</span>{' '}
              <span className="text-[#9299B2]">
                Transactions utilize simulated credentials in the official PayPal Sandbox environment without incurring real financial charges.
              </span>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-6 border-t border-white/10 bg-[#151A2B]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#9299B2] font-label">
            PayPilot Commerce AI © 2026. All rights reserved.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onExplore();
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Explore Catalogue
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchAssistant();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white text-xs font-bold transition-all shadow-md glow-violet-refined flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Meet AI Shopper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
