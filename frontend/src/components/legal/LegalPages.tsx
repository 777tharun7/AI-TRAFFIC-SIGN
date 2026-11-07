import React, { useState } from 'react';
import { ShieldCheck, Cookie, FileText, CheckCircle2, ChevronLeft, ArrowRight, Lock } from 'lucide-react';

interface LegalProps {
  onNavigate: (view: string) => void;
}

export const CookieSettingsView: React.FC<LegalProps> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState(false);
  const [preferences, setPreferences] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('toom4way_cookie_analytics', String(analytics));
    localStorage.setItem('toom4way_cookie_preferences', String(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium mb-3 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Cookie className="w-6 h-6 text-[#00875A]" /> Cookie Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Control how Toom4Way stores and accesses technical telemetry, security tokens, and optional performance analytics.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
          Preferences saved successfully.
        </div>
      )}

      <div className="space-y-4">
        {/* Essential */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Essential & Security Storage</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                Always Active
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Required for real-time WebSocket vehicle state synchronization, authentication token verification, and security rate limiting. These cannot be disabled.
          </p>
        </div>

        {/* Analytics */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Analytics & Performance Diagnostics</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00875A]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Helps us monitor AI model latency percentiles, WebSocket reconnect rates, and map tile loading efficiency across Indian corridors. No personal data is stored.
          </p>
        </div>

        {/* Preferences */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">User Interface & Map Preferences</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences}
                onChange={(e) => setPreferences(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00875A]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Remembers your selected map layer (Traffic / Satellite / 3D), corridor filters, and audio alert settings between browser sessions.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={() => {
            setAnalytics(true);
            setPreferences(true);
            handleSave();
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-[#00875A] hover:bg-[#00744E] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export const PrivacyPolicyView: React.FC<LegalProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 text-slate-800">
      <button
        onClick={() => onNavigate('home')}
        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1 font-mono">Last updated: October 2026 • Toom4Way Compliance Framework</p>
      </div>

      <div className="prose prose-sm prose-slate max-w-none space-y-6 text-xs leading-relaxed text-slate-600">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            Toom4Way is an intelligent mobility and predictive road intelligence research platform. We process:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Kinematic Telemetry:</strong> Vehicle speed, spatial heading coordinates, deceleration metrics, and along-track distance.</li>
            <li><strong>Vision Inference Metadata:</strong> Bounding box coordinates, 43-class GTSRB softmax classification probabilities, and inference latency.</li>
            <li><strong>Infrastructure Feeds (V2X / SPaT):</strong> Traffic signal phase and timing countdowns, Virtual RIU beacon IDs, and advisory geofences.</li>
            <li><strong>User Account Information:</strong> Operator name, organization, email, and authentication credentials.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Real-Time Camera & Video Data</h2>
          <p>
            When utilizing live camera perception, raw video frames are processed locally within ephemeral sub-pixel inference tensors. Toom4Way does not store raw biometric or surveillance video without explicit operator opt-in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Geospatial & Map Matching Compliance</h2>
          <p>
            GPS coordinates are matched against OpenStreetMap road vectors and simulated Hyderabad test corridors. Location data is ephemeral and strictly gated by heading validation ($\pm30^\circ$).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Contact Information</h2>
          <p>
            For compliance inquiries, contact the Toom4Way Engineering & Research Governance Team at <span className="font-mono text-slate-900">privacy@toom4way.ai</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsOfServiceView: React.FC<LegalProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 text-slate-800">
      <button
        onClick={() => onNavigate('home')}
        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1 font-mono">Last updated: October 2026</p>
      </div>

      <div className="prose prose-sm prose-slate max-w-none space-y-6 text-xs leading-relaxed text-slate-600">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Platform Scope & Non-Autonomous Disclaimer</h2>
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
            <strong>Important Safety Notice:</strong> Toom4Way is an advisory, predictive intelligence and simulation platform. It is not an approved autonomous driving system and does not assume legal responsibility for real-world vehicular control.
          </div>
          <p>
            All decisions, green-wave speeds, and stop distance calculations (d_stop = v·t + v²/(2·μ·g)) represent algorithmic models and driver advisories.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Simulated vs Live V2X Infrastructure</h2>
          <p>
            The software clearly labels simulated roadside units (V-RIUs) and development SPaT broadcasts with the <code>SIMULATED</code> badge. Operators may not misrepresent synthetic test scenarios as official municipal traffic infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Intellectual Property</h2>
          <p>
            The Toom4Way Decision Engine, spatial context fusion pipeline, and neural architecture implementations are protected under applicable open mobility research licenses.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-slate-200">
          <h2 className="text-base font-bold text-[#00875A] flex items-center gap-2">
            <span>4. Academic Affiliation, Industry Collaboration & Faculty Mentorship</span>
          </h2>
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-emerald-950 font-medium">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="p-1 rounded bg-[#00875A] text-white text-xs">🏛️</span>
              <span>Manav Rachna College × Xebia Engineering Collaboration</span>
            </div>
            <p>
              This website, predictive road intelligence research, and associated software codebase is developed under <strong>Manav Rachna College</strong> (Manav Rachna International Institute of Research & Studies) in partnership with <strong>Xebia</strong>, and developed under the academic supervision and faculty mentorship of <strong>Roshi Mam</strong> (Faculty Mentor).
            </p>
            <p className="text-[11px] text-emerald-800 font-mono">
              Institutional Framework: Manav Rachna College • Industry Partner: Xebia • Faculty Mentor: Roshi Mam • Research Domain: AI Traffic Sign & Predictive Road Intelligence
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
