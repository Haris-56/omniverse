"use client";
import React, { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { Mail, Lock, CheckCircle2, ShieldCheck, Sparkles, Globe, UserPlus, LogIn, Chrome } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (ctx) => {
        setError(ctx.error.message || "Invalid credentials provided");
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FAFBFF] overflow-hidden">
      
      {/* LEFT PANEL - Glassmorphic Aesthetic */}
      <div className="md:w-[45%] lg:w-[40%] bg-[#6F3FF5] relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 text-white shrink-0">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-purple-400/30 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-indigo-400/30 blur-[100px] rounded-full animate-pulse decoration-3000" />
        
        <div className="relative z-10 max-w-sm w-full">
           <div className="flex items-center gap-3 mb-10 group cursor-default">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                <Globe size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter">Omniverse</h2>
           </div>

           <h1 className="text-4xl lg:text-5xl font-black leading-[1.1] mb-8 tracking-tight">
             Reignite your <span className="text-indigo-200">automation</span> pipeline.
           </h1>

           <div className="space-y-6">
              {[
                "Advanced Multi-Channel Orchestration",
                "Autonomous AI Agent Deployment",
                "Unified Outreach Intelligence",
                "Scalability without Boundaries"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={14} className="text-indigo-200" />
                  </div>
                  <span className="text-lg font-bold text-indigo-50/90">{text}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Bottom Floating Card - Visual Polish */}
        <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] hidden lg:block">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                 <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-0.5">Security Protocol</p>
                 <p className="text-xs font-bold text-indigo-50 leading-relaxed">End-to-end encrypted automation nodes.</p>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL - Clean Modern Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md animate-in slide-in-from-right-4 duration-700">
          
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-bold">Access your unified command center.</p>
          </div>

          <button className="w-full group bg-white border border-gray-100 py-4 px-6 rounded-2xl flex items-center gap-4 hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
             <div className="w-10 h-10 bg-white shadow-md border border-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Chrome size={20} className="text-blue-600" />
             </div>
             <span className="font-black text-gray-700 text-sm tracking-tight">Sync with Google Account</span>
          </button>

          <div className="flex items-center my-10">
            <div className="grow h-px bg-gray-50"></div>
            <span className="px-5 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">Credential Access</span>
            <div className="grow h-px bg-gray-50"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-shake">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-rose-100">
                   <Lock size={16} className="text-rose-500" />
                </div>
                <p className="text-xs font-bold text-rose-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Universal Email</label>
               <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                     <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="operator@omniverse.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Key</label>
                  <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Reset Pipeline</button>
               </div>
               <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                     <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300"
                  />
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#6F3FF5] text-white font-black text-lg rounded-2xl shadow-2xl shadow-purple-500/30 hover:bg-[#5c2cd9] hover:-translate-y-1 transition-all disabled:opacity-70 active:scale-[0.98] flex items-center justify-center gap-3 mt-10"
            >
              {loading ? (
                 <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-gray-400 font-bold text-sm">
            Terminal Access Restricted. <a href="/register" className="text-gray-900 hover:text-indigo-600 transition-colors ml-1">Initialize New Account</a>
          </p>
        </div>

        {/* Corner Decoration */}
        <div className="absolute bottom-6 right-6 hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
           <Sparkles size={12} className="text-amber-400" />
           Alpha Protocol 1.0.4
        </div>
      </div>
    </div>
  );
}
