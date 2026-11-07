import React, { useState } from 'react';
import { 
  ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, 
  CheckCircle2, AlertCircle, RefreshCw, ChevronLeft, User
} from 'lucide-react';

interface AuthProps {
  onNavigate: (view: string) => void;
  onLoginSuccess?: (user: { name: string; email: string }) => void;
}

export const LoginView: React.FC<AuthProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid work or academic email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === 'fail@test.com') {
        setError('Invalid credentials. Please check your email or password.');
      } else {
        if (onLoginSuccess) {
          onLoginSuccess({ name: email.split('@')[0], email });
        }
        onNavigate('home');
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F6F8FB]">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00875A] text-white shadow-sm mb-1">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22L9 2M20 22L15 2" stroke="white" strokeWidth="2.5" />
              <path d="M12 5V8M12 12V15M12 19V22" stroke="white" strokeWidth="2" strokeDasharray="1 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-500">Sign in to continue to Toom4Way Predictive Road Intelligence.</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A] text-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot_password')}
                className="text-xs text-[#00875A] hover:underline font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A] text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#00875A] focus:ring-[#00875A]"
              />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-mono absolute">or</span>
        </div>

        <button
          onClick={() => {
            if (onLoginSuccess) onLoginSuccess({ name: 'Google User', email: 'user@google.com' });
            onNavigate('home');
          }}
          className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2.5 cursor-pointer transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#00875A] font-bold hover:underline cursor-pointer"
          >
            Create account
          </button>
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
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F6F8FB]">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00875A] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We sent a verification link to <strong className="text-slate-800">{email}</strong>. Please click the link to activate your Toom4Way account.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('verify_email')}
              className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              Simulate Email Verification Link
            </button>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F6F8FB]">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 space-y-6">
        
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create your Toom4Way account</h2>
          <p className="text-xs text-slate-500">Access real-time perception, V2X feeds, and predictive decision engines.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Dr. Anand Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="anand@mobility.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Confirm password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A]"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#00875A] focus:ring-[#00875A]"
            />
            <label htmlFor="agree" className="text-xs text-slate-600 leading-tight cursor-pointer">
              I agree to the{' '}
              <button type="button" onClick={() => onNavigate('terms')} className="text-[#00875A] font-semibold hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" onClick={() => onNavigate('privacy')} className="text-[#00875A] font-semibold hover:underline">
                Privacy Policy
              </button>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer mt-2"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#00875A] font-bold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
};

export const VerifyEmailView: React.FC<AuthProps> = ({ onNavigate }) => {
  const [verified, setVerified] = useState(true);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F6F8FB]">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00875A] mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Email verified successfully</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your account is verified and ready. You now have full access to Toom4Way road intelligence modules and APIs.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
        >
          Continue to Toom4Way
        </button>
      </div>
    </div>
  );
};

export const ForgotPasswordView: React.FC<AuthProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F6F8FB]">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 space-y-5">
        
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium mb-3"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to sign in
          </button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reset your password</h2>
          <p className="text-xs text-slate-500">Enter your account email and we'll send you instructions to reset your password.</p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
            <CheckCircle2 className="w-6 h-6 text-[#00875A] mx-auto" />
            <div className="text-xs font-bold text-emerald-900">Reset instructions sent</div>
            <p className="text-xs text-emerald-700">
              If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00875A]/20 focus:border-[#00875A]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00875A] hover:bg-[#00744E] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
