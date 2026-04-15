"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Lock, Mail, 
  ArrowRight, Loader2, CheckCircle2,
  AlertCircle, Zap, Shield, Key, Hexagon
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
      const res = await fetch("/api/system/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
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
    <div className="min-h-screen bg-[#F8F4F2] flex items-center justify-center p-10 font-sans relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="fixed -top-64 -left-64 w-[800px] h-[800px] bg-[#B78D7D]/[0.08] rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed -bottom-64 -right-64 w-[600px] h-[600px] bg-[#8E7A70]/[0.1] rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="w-full max-w-[600px] relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="bg-white/40 backdrop-blur-2xl rounded-[5rem] border-2 border-[#B78D7D]/15 p-16 lg:p-24 shadow-[0_50px_100px_rgba(183,141,125,0.12)] relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity" />
           
          <div className="text-center mb-16 relative z-10">
            <div className="w-28 h-28 bg-[#F8F4F2] border-2 border-[#B78D7D]/15 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl transition-all duration-700 group-hover:rotate-12 group-hover:border-[#B78D7D] group-hover:scale-110">
              <ShieldCheck size={48} className="text-[#B78D7D]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#3E3A39] tracking-tighter uppercase mb-6 leading-none italic">Admin_<span className="text-[#B78D7D]">Sector</span></h1>
            <p className="text-[#B2AAA6] font-black uppercase tracking-[0.4em] text-[11px] font-mono italic opacity-60 leading-none">Infrastructure_Protection_Layer</p>
          </div>

          {error && (
            <div className="mb-12 p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] flex items-center gap-6 text-rose-600 text-[11px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 font-mono shadow-sm relative z-10">
              <AlertCircle size={24} className="shrink-0" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentials} className="space-y-12 relative z-10">
              <div className="space-y-5">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-8 font-mono italic">Authority_Identifier</label>
                <div className="relative group/field">
                  <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within/field:text-[#B78D7D] transition-all" size={24} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ADMIN_NODE::SIGNATURE"
                    className="w-full pl-22 pr-10 py-7 bg-[#F8F4F2]/50 border-2 border-transparent border-b-[#B78D7D]/15 rounded-3xl text-[#3E3A39] font-black placeholder:text-[#B2AAA6] outline-none focus:border-b-[#B78D7D] focus:bg-white transition-all font-mono text-base shadow-inner italic"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-8 font-mono italic">Encryption_Secret</label>
                <div className="relative group/field">
                  <Key className="absolute left-8 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within/field:text-[#B78D7D] transition-all" size={24} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-22 pr-10 py-7 bg-[#F8F4F2]/50 border-2 border-transparent border-b-[#B78D7D]/15 rounded-3xl text-[#3E3A39] font-black placeholder:text-[#B2AAA6] outline-none focus:border-b-[#B78D7D] focus:bg-white transition-all font-mono text-base shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-8 bg-[#B78D7D] hover:bg-[#A37B6D] text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-[0_25px_50px_rgba(183,141,125,0.3)] flex items-center justify-center gap-5 group font-mono active:scale-95 border border-white/10"
              >
                {loading ? <Loader2 size={28} className="animate-spin" /> : (
                  <>
                    Initialize_Node_Auth
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-12 relative z-10">
              <div className="text-center p-10 bg-[#F8F4F2] rounded-[3.5rem] border border-[#B78D7D]/15 mb-12 shadow-inner group/sync">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm transition-transform duration-700 group-hover/sync:rotate-12">
                   <Shield size={32} className="text-emerald-500" />
                </div>
                <p className="text-[#8E7A70] text-[11px] font-black leading-relaxed italic uppercase font-mono tracking-widest">
                   Security cipher dispatched to master node. Synchronize 2FA registry.
                </p>
              </div>

              <div className="space-y-6 text-center">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono italic block w-full">2FA_Encrypted_Cipher</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000 000"
                    maxLength={6}
                    className="w-full px-10 py-10 bg-white border-2 border-[#B78D7D]/20 rounded-[3rem] text-[#3E3A39] text-center text-6xl font-black tracking-[0.4em] placeholder:text-[#F8F4F2]/50 outline-none focus:border-[#B78D7D] transition-all font-mono shadow-xl italic"
                  />
                  <div className="absolute -inset-2 bg-[#B78D7D]/5 rounded-[3.5rem] -z-10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-[0_25px_50px_rgba(16,185,129,0.2)] flex items-center justify-center gap-5 font-mono active:scale-95 border border-white/10"
              >
                {loading ? <Loader2 size={28} className="animate-spin" /> : "Verify_Identity_Node"}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-[#B2AAA6] font-black text-[10px] uppercase tracking-[0.5em] hover:text-[#B78D7D] transition-colors font-mono italic leading-none"
              >
                Abort_Protocol_Return
              </button>
            </form>
          )}

          <div className="mt-20 pt-10 border-t border-[#F8F4F2] text-center">
             <p className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] font-mono opacity-60 leading-none">Omniverse_Security_Group :: SECTOR_A3_INFRA</p>
          </div>
        </div>
      </div>
      
      {/* Branding Watermark */}
      <div className="fixed bottom-12 right-12 pointer-events-none opacity-[0.03] select-none z-0">
          <div className="flex items-center gap-8 grayscale">
             <Hexagon size={120} strokeWidth={1} className="text-[#B78D7D] animate-spin-slow" />
             <h1 className="text-[12rem] font-black font-sans tracking-tighter uppercase leading-none text-[#B78D7D]">LOGIN</h1>
          </div>
      </div>
    </div>
  );
}
