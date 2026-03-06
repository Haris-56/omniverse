"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Lock, Mail, 
  ArrowRight, Loader2, CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function SystemLogin() {
  const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. First verify credentials via API
      const res = await fetch("/api/system/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // 2. If valid, send 2FA code
        const codeRes = await fetch("/api/system/auth/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        if (codeRes.ok) {
          setStep(2);
        } else {
          setError("Failed to send verification code. Please try again.");
        }
      } else {
        setError(data.error || "Invalid administrator credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/system/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to dashboard
        window.location.href = "/system";
      } else {
        setError(data.error || "Invalid or expired verification code.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="w-full max-w-[440px] relative">
        {/* Glow effect */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />

        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">System Access</h1>
            <p className="text-slate-400 font-medium mt-2">Administrator verification required.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentials} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Identifier</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@omniverse.com"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Access Protocol</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <>
                    Initialize Login
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5 mb-8">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-300 text-sm font-medium">
                  A security code has been dispatched to your registered authority email.
                </p>
                <p className="text-indigo-400 font-black text-xs mt-2 uppercase tracking-widest">
                  CHECK INBOX
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">2FA Verification Code</label>
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-center text-2xl font-black tracking-[0.5em] placeholder:text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify Identity"}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
              >
                Back to credentials
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Omniverse Infrastructure Group</p>
          </div>
        </div>
      </div>
    </div>
  );
}
