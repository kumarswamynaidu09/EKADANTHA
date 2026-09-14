import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Key, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Subtle delay for realistic authentication feedback
    setTimeout(() => {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      if (trimmedUser === 'adminganesha' && trimmedPass === 'ganesha@1409') {
        setIsLoading(false);
        setIsSuccess(true);
        setError(null);

        // Allow success celebration animation before transition
        setTimeout(() => {
          localStorage.setItem('ekadantha_admin_auth', 'true');
          onLoginSuccess();
        }, 700);
      } else {
        setIsLoading(false);
        setError('Access Denied: Invalid administrator credentials.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-sans overflow-y-auto"
      style={{
        background: 'radial-gradient(circle at 50% 35%, #0b2419 0%, #05140e 55%, #020906 100%)',
      }}
    >
      {/* Ambient background glow & radial lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="mandala-bg fixed inset-0 pointer-events-none opacity-25 z-0" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={
          shake
            ? { x: [-12, 12, -10, 10, -5, 5, 0], opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-[#051c13]/90 backdrop-blur-2xl rounded-3xl border border-amber-500/30 p-7 sm:p-9 shadow-2xl shadow-emerald-950/80 z-10 overflow-hidden text-emerald-50"
      >
        {/* Top Gold Gradient Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

        {/* Sacred Header with Emblem */}
        <div className="text-center mb-7">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.1 }}
            className="mx-auto relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/30 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/15 mb-4 group"
          >
            <span className="select-none filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
              🕉️
            </span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
            </span>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-tight">
            EKADANTHA
          </h1>
          <p className="text-xs font-medium text-amber-200/70 uppercase tracking-widest mt-1">
            Sai Ganesh Residency
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300/80 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full mt-2.5">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Authorized Administrator Portal</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter admin username"
                required
                autoFocus
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 bg-[#08291b] border border-amber-500/25 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-sm text-emerald-100 placeholder-emerald-400/30 outline-none transition shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter master password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-[#08291b] border border-amber-500/25 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-sm text-emerald-100 placeholder-emerald-400/30 outline-none transition shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/60 hover:text-amber-300 transition focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="flex items-center gap-2 text-xs font-medium text-rose-300 bg-rose-500/15 border border-rose-500/30 rounded-xl p-2.5 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 ${
                isSuccess
                  ? 'bg-emerald-500 text-emerald-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-emerald-950 shadow-amber-500/25 hover:shadow-amber-500/40'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-emerald-950/40 border-t-emerald-950 rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : isSuccess ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-950 animate-bounce" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-emerald-950 text-emerald-950" />
                  <span>Enter Sacred Console</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Notice Footer */}
        <div className="mt-6 pt-5 border-t border-amber-500/15 text-center text-[11px] text-emerald-300/50 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400/60" />
          <span>Restricted hardware automation system</span>
        </div>
      </motion.div>
    </div>
  );
}
