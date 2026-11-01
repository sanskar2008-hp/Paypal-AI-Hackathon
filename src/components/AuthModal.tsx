import React from 'react';
import { X, Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; role: 'customer' | 'seller' }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState<'customer' | 'seller'>('customer');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userName = name.trim() || email.split('@')[0];
      setSuccessMsg(`Welcome, ${userName}! Access granted.`);
      setTimeout(() => {
        onSuccess({ name: userName, email, role });
        onClose();
      }, 700);
    }, 600);
  };

  const handleQuickDemoLogin = (selectedRole: 'customer' | 'seller') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = selectedRole === 'customer'
        ? { name: 'Marcus Vance', email: 'm.vance@example.com', role: 'customer' as const }
        : { name: 'NovaTech Merchant', email: 'merchant@paypilot.io', role: 'seller' as const };
      setSuccessMsg(`Authenticated as ${user.name}`);
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#101321] border border-[#8757FF]/30 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl text-[#F5F6FF] my-8 grid grid-cols-1 md:grid-cols-12 text-left">
        {/* Left Side: Luxury Brand Visual */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#151A2B] via-[#101321] to-[#080A12] p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8757FF]/15 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8757FF] to-[#43D9FF] flex items-center justify-center font-bold text-white text-lg shadow-md">
                P
              </div>
              <div>
                <span className="font-extrabold font-display text-white text-base tracking-tight block">
                  PAYPILOT
                </span>
                <span className="text-[10px] text-[#43D9FF] font-label font-bold uppercase tracking-wider">
                  COMMERCE AI
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8757FF] block font-label">
                Neo-Futuristic Commerce
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
                THE FUTURE OF COMMERCE IS INTELLIGENT.
              </h3>
              <p className="text-xs text-[#9299B2] leading-relaxed pt-1">
                Access your personalized shopping workspace, customer-approved cart assemblies, and verified PayPal Sandbox telemetry.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5 text-xs text-[#9299B2]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38D99A]" />
              <span className="text-white/90">Catalogue-grounded AI shopping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#43D9FF]" />
              <span className="text-white/90">Strict agentic cart approval</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8757FF]" />
              <span className="text-white/90">Official PayPal Sandbox REST</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="md:col-span-7 p-8 relative flex flex-col justify-between">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#9299B2] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-[#151A2B] rounded-xl border border-white/5 w-fit mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#8757FF] text-white shadow-xs'
                    : 'text-[#9299B2] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#8757FF] text-white shadow-xs'
                    : 'text-[#9299B2] hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-1">
              {mode === 'login' ? 'Welcome back to PayPilot' : 'Begin your intelligent shopping journey'}
            </h3>
            <p className="text-xs text-[#9299B2] mb-5">
              {mode === 'login'
                ? 'Enter your credentials to access your orders and assistant session.'
                : 'Create an account to save preferences and track orders in real-time.'}
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#151A2B] border border-white/10 text-white placeholder:text-white/20 focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF]"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9299B2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#151A2B] border border-white/10 text-white placeholder:text-white/20 focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9299B2] block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9299B2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#151A2B] border border-white/10 text-white placeholder:text-white/20 focus:outline-hidden focus:border-[#8757FF] focus:ring-1 focus:ring-[#8757FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9299B2] hover:text-white p-0.5 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#8757FF] to-[#6836F5] hover:from-[#9569FF] hover:to-[#7645FF] text-white font-bold rounded-xl shadow-md glow-violet-refined transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to PayPilot' : 'Complete Registration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo Login shortcuts for judges & testing */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-[#9299B2] block mb-2">
              Demo Credentials (1-Click Authenticate):
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-white transition-colors cursor-pointer"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller')}
                className="px-3 py-1.5 rounded-lg bg-[#8757FF]/15 hover:bg-[#8757FF]/25 border border-[#8757FF]/30 text-[11px] font-semibold text-[#43D9FF] transition-colors cursor-pointer"
              >
                Demo Merchant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
