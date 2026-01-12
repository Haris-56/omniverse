"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  User, 
  Chrome, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function Register() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await authClient.signUp.email({
      email: email,
      password: password,
      name: name,
      image: "https://example.com/image.png",
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        router.push('/')
      },
      onError: (ctx) => {
        console.error("SIGNUP_ERROR:", ctx.error);
        alert(ctx.error?.message || "An unknown error occurred during signup");
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FAFBFF] overflow-hidden">
      
      {/* LEFT PANEL - Register Narrative */}
      <div className="md:w-[45%] lg:w-[40%] bg-[#6F3FF5] relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 text-white shrink-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-purple-400/30 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-indigo-400/30 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-sm w-full">
           <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                <Globe size={28} />
              </div>
              <h2 className="text-2xl font-black tracking-tighter">Omniverse</h2>
           </div>

           <h1 className="text-4xl lg:text-5xl font-black leading-[1.1] mb-8 tracking-tight">
             Start your <span className="text-indigo-200">autonomous</span> journey.
           </h1>

           <div className="space-y-6">
              {[
                "Unlimited Campaign Nodes",
                "Advanced AI Persona Training",
                "Global Performance Analytics",
                "Priority Channel Sync"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <CheckCircle2 size={14} className="text-indigo-200" />
                  </div>
                  <span className="text-lg font-bold text-indigo-50/90 tracking-tight">{text}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Floating Stat Card */}
        <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] hidden lg:block">
           <div className="flex items-center gap-5">
              <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg">
                 <Sparkles size={24} className="text-amber-300" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Join the Elite</p>
                 <p className="text-sm font-bold text-white tracking-tight">Over 2,400+ operators active today.</p>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL - Spacious Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white relative">
        <Link href="/login" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors">
           <ChevronLeft size={16} />
           Back to Login
        </Link>

        <div className="w-full max-w-md animate-in slide-in-from-right-4 duration-700">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Identity</h1>
            <p className="text-gray-500 font-bold">Initialize your master operator account.</p>
          </div>

          <button className="w-full group bg-white border border-gray-100 py-4 px-6 rounded-[1.5rem] flex items-center gap-4 hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
             <div className="w-10 h-10 bg-white shadow-md border border-gray-50 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Chrome size={20} className="text-blue-600" />
             </div>
             <span className="font-black text-gray-700 text-sm tracking-tight">Onboard with Google Workspace</span>
          </button>

          <div className="flex items-center my-10">
            <div className="grow h-px bg-gray-50"></div>
            <span className="px-5 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">OR MANUAL REGISTRY</span>
            <div className="grow h-px bg-gray-50"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operator Name</label>
               <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                     <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Commander John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Universal Email</label>
               <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                     <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="you@agency.bot"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Master Key</label>
                  <button type="button" onClick={() => setShow(!show)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline transition-all">
                    {show ? "Obfuscate" : "Visualize"}
                  </button>
               </div>
               <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                     <Lock size={18} />
                  </div>
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300"
                  />
               </div>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
               <ShieldCheck size={18} className="text-indigo-500 shrink-0" />
               <p className="text-[10px] font-bold text-indigo-700 leading-tight">By initializing, you agree to our Protocol Terms and Data Safeguard Policy.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#6F3FF5] text-white font-black text-lg rounded-[1.5rem] shadow-2xl shadow-purple-500/30 hover:bg-[#5c2cd9] hover:-translate-y-1 transition-all disabled:opacity-70 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                 <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Initialize System</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-400 font-bold text-sm">
            Existing Authority? <Link href="/login" className="text-gray-900 hover:text-indigo-600 transition-colors ml-1">Authenticate Identity</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
