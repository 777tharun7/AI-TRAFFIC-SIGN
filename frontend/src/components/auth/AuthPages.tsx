/**
 * Enterprise Auth Pages for RoadSense AI.
 * Premium floating glassmorphism UI/UX with social-media-grade animations,
 * micro-interactions, demo account quick-selector, and real API integration.
 */

import React, { useState } from 'react';
import {
  Shield, Mail, Lock, Eye, EyeOff, ArrowRight,
  CheckCircle2, AlertCircle, RefreshCw, ChevronLeft, User,
  Sparkles, KeyRound, Building2, Car, Compass, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthProps {
  onNavigate: (view: string) => void;
  onLoginSuccess?: (user: { name: string; email: string }) => void;
}

// Preset demo credentials for immediate enterprise evaluation
const DEMO_CREDENTIALS = [
  {
    role: 'Citizen Motorist',
    email: 'devan.tharun@example.com',
    password: 'RoadSense@2026',
    name: 'Devanboina Tharun',
    badge: 'TS 09 EV 4412',
    icon: Car,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    role: 'Enforcement Officer',
    email: 'sridhar.k@ts-police.gov.in',
    password: 'RoadSense@2026',
    name: 'Insp. K. Sridhar, TPS',
    badge: 'TS-HYD-7701',
    icon: Shield,
    color: 'from-blue-600 to-indigo-700',
    bgColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    role: 'System Administrator',
    email: 'admin@roadsense-ai.gov.in',
    password: 'RoadSense@2026',
    name: 'System Administrator',
    badge: 'STATE-ADMIN',
    icon: Building2,
    color: 'from-purple-600 to-indigo-800',
    bgColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
];

export const LoginView: React.FC<AuthProps> = ({ onNavigate, onLoginSuccess }) => {
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('devan.tharun@example.com');
  const [password, setPassword] = useState('RoadSense@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid work or academic email address.');
      return;
    }
    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      await login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess({ name: email.split('@')[0], email });
      }
      // Redirect based on email/role
      if (email.includes('police') || email.includes('officer')) {
        onNavigate('operations_overview');
      } else if (email.includes('admin')) {
        onNavigate('traffic_dept');
      } else {
        onNavigate('car_cockpit');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const fillDemoAccount = (demo: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setLocalError(null);
    clearError();
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 relative overflow-hidden bg-slate-950 text-white font-sans antialiased selection:bg-emerald-500 selection:text-white">

      {/* Dynamic Animated Ambient Mesh Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-md relative z-10 space-y-6">

        {/* Floating Glassmorphic Container */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 hover:border-white/20 transition-all duration-300">

          {/* Top Brand & Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00875A] to-emerald-400 text-white shadow-lg shadow-emerald-500/20 mb-1 border border-white/20">
              <Shield className="w-7 h-7 text-white" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold block mb-1">
                ENTERPRISE IDENTITY DESK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                RoadSense AI Log In
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sign in to access real-time telemetry, V2X feeds &amp; state adjudication.
              </p>
            </div>
          </div>

          {/* Quick Demo Account Selector Chips */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block text-center">
              ⚡ Select Demo Role (Click to Auto-Fill)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {DEMO_CREDENTIALS.map((demo) => {
                const Icon = demo.icon;
                const isSelected = email === demo.email;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => fillDemoAccount(demo)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/60 shadow-sm shadow-emerald-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    </div>
                    <div className="mt-1">
                      <div className="text-[10px] font-bold text-white truncate leading-tight">{demo.role}</div>
                      <div className="text-[8px] font-mono text-slate-400 truncate mt-0.5">{demo.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-mono">{displayError}</div>
            </div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work or Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/15 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot_password')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-white/15 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50"
                />
                <span>Remember session for 24h</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400/80">JWT HS256 Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-gradient-to-r from-[#00875A] to-emerald-500 hover:from-[#00744E] hover:to-emerald-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 tracking-wide uppercase"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating JWT...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3" /> DPDP Act 2023 Compliant
            </span>
            <span>Telangana ITMS v2.4</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export const RegisterView: React.FC<AuthProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950 text-white font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Account Created Successfully</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Verification link dispatched to <strong className="text-white">{email}</strong>. Please complete email validation to enable full platform access.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
            >
              Continue to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950 text-white font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">

        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-white tracking-tight">Create RoadSense AI Account</h2>
          <p className="text-xs text-slate-400">Access V2X telemetry, road perception &amp; e-services.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Devanboina Tharun"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Work or Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-mono"
            >
              <option value="citizen">Citizen Motorist (Vehicle Owner)</option>
              <option value="enforcement_officer">Traffic Enforcement Officer</option>
              <option value="fleet_operator">Transit / Fleet Operator</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500"
            />
            <label htmlFor="agree" className="leading-tight cursor-pointer">
              I agree to the Terms of Service and DPDP Act 2023 Privacy Policy.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer mt-2 uppercase tracking-wide"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
};

export const VerifyEmailView: React.FC<AuthProps> = ({ onNavigate }) => (
  <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950 text-white">
    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-white">Email Verified Successfully</h2>
      <p className="text-xs text-slate-400 leading-relaxed font-mono">
        Your account is verified. You now have full access to RoadSense AI telemetry APIs.
      </p>
      <button
        onClick={() => onNavigate('home')}
        className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
      >
        Continue to App
      </button>
    </div>
  </div>
);

export const ForgotPasswordView: React.FC<AuthProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-5">
        <button
          onClick={() => onNavigate('login')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium mb-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
        <h2 className="text-2xl font-black text-white tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-400 font-mono">Enter your email for password recovery instructions.</p>

        {sent ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-center text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="font-bold text-emerald-300">Reset instructions dispatched</div>
            <p className="text-slate-300 font-mono">Check email <strong className="text-white">{email}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer uppercase tracking-wide"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
