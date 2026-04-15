"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  CheckCircle2, 
  User, 
  Chrome, 
  ArrowRight,
  ChevronLeft,
  Activity,
  Hexagon,
  ShieldCheck
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
        alert(ctx.error?.message || "Something went wrong. Please try again.");
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8F4F2] overflow-hidden font-sans relative">
      
      {/* LEFT PANEL - Friendly Branding */}
      <div className="md:w-[45%] lg:w-[40%] bg-white border-r border-[#B78D7D]/15 relative overflow-hidden flex flex-col items-center justify-center p-10 md:p-16 lg:p-24 shrink-0 shadow-lg z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[60%] bg-[#B78D7D]/[0.05] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#B78D7D]/[0.05] blur-[150px] rounded-full animate-pulse duration-3000" />
        
        <div className="relative z-10 max-w-sm w-full space-y-20">
           <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/15 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <Hexagon size={36} className="text-[#B78D7D]" />
              </div>
              <div>
                 <h2 className="text-4xl font-black tracking-tighter text-[#3E3A39] uppercase font-sans leading-none">Omniverse</h2>
              </div>
           </div>

           <div className="space-y-8">
             <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter text-[#3E3A39] uppercase">
               Get <br/> <span className="text-[#B78D7D]">Started</span> Today.
             </h1>
             <p className="text-xl text-[#8E7A70] font-bold leading-relaxed border-l-4 border-[#B78D7D]/20 pl-8">
               Use Omniverse to talk to your customers and grow your business.
             </p>
           </div>

           <div className="space-y-12">
              {[
                "Talk to more people",
                "Simple to use",
                "Stay safe online",
                "Get help from AI"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#F8F4F2] flex items-center justify-center border border-[#B78D7D]/10 group-hover:scale-110 transition-all duration-500 group-hover:bg-[#B78D7D] group-hover:text-white shadow-sm text-[#B78D7D]">
                    <CheckCircle2 size={24} className="opacity-80 group-hover:opacity-100" />
                  </div>
                  <span className="text-xl font-black text-[#5E5A59] tracking-tight group-hover:text-[#3E3A39] transition-all uppercase font-sans">{text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* RIGHT PANEL - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-10 md:p-16 lg:p-32 relative overflow-y-auto z-10 bg-[#F8F4F2]/50">
        <Link href="/login" className="absolute top-16 left-16 flex items-center gap-5 text-[#B2AAA6] hover:text-[#B78D7D] font-black text-[10px] uppercase tracking-[0.4em] transition-all group font-mono">
           <div className="p-4 rounded-2xl bg-white border border-[#B78D7D]/15 group-hover:border-[#B78D7D]/40 transition-all shadow-sm">
            <ChevronLeft size={20} />
           </div>
           Back to Login
        </Link>

        <div className="w-full max-w-lg animate-in slide-in-from-right-12 duration-1000">
          <div className="mb-20">
            <div className="w-24 h-24 bg-white text-[#B78D7D] rounded-[2.5rem] flex items-center justify-center border border-[#B78D7D]/15 mb-14 shadow-lg group-hover:rotate-12 transition-transform">
              <UserPlus size={48} />
            </div>
            <h1 className="text-6xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase leading-none">Get Started</h1>
            <p className="text-[#8E7A70] font-bold text-xl uppercase tracking-[0.2em] text-xs opacity-60">Create your account to begin</p>
          </div>

          <button className="w-full group bg-white border border-[#B78D7D]/15 p-8 rounded-[2.5rem] flex items-center gap-8 hover:border-[#B78D7D]/40 hover:bg-[#F8F4F2] transition-all shadow-sm active:scale-[0.98]">
             <div className="w-16 h-16 bg-[#F8F4F2] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform border border-[#B78D7D]/10 shadow-inner">
                <Chrome size={28} className="text-[#3E3A39]" />
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mb-2">Social Login</p>
                <span className="font-black text-[#3E3A39] text-xl tracking-tighter uppercase leading-none">Sign up with Google</span>
             </div>
          </button>

          <div className="flex items-center my-16">
            <div className="grow h-[1.5px] bg-[#B78D7D]/10"></div>
            <span className="px-10 text-[#B2AAA6] text-[10px] font-black uppercase tracking-[0.6em] font-mono whitespace-nowrap">Or use email</span>
            <div className="grow h-[1.5px] bg-[#B78D7D]/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
               <label className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] ml-10 font-mono">What is your name?</label>
               <div className="relative group/input">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within/input:text-[#B78D7D] transition-colors pointer-events-none">
                     <User size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white border border-[#B78D7D]/15 px-24 py-8 rounded-[3rem] outline-none focus:border-[#B78D7D]/40 transition-all font-black text-[#3E3A39] text-xl shadow-sm group-hover/input:border-[#B78D7D]/30"
                  />
               </div>
            </div>

            <div className="space-y-6">
               <label className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] ml-10 font-mono">Your email address</label>
               <div className="relative group/input">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within/input:text-[#B78D7D] transition-colors pointer-events-none">
                     <Mail size={24} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-[#B78D7D]/15 px-24 py-8 rounded-[3rem] outline-none focus:border-[#B78D7D]/40 transition-all font-black text-[#3E3A39] text-xl shadow-sm group-hover/input:border-[#B78D7D]/30"
                  />
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-center px-10">
                  <label className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] font-mono">Pick a secret password</label>
                  <button type="button" onClick={() => setShow(!show)} className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] hover:text-[#A37B6D] transition-all font-mono">
                    {show ? "Hide" : "Show"}
                  </button>
               </div>
               <div className="relative group/input">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within/input:text-[#B78D7D] transition-colors pointer-events-none">
                     <Lock size={24} />
                  </div>
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white border border-[#B78D7D]/15 px-24 py-8 rounded-[3rem] outline-none focus:border-[#B78D7D]/40 transition-all font-black text-[#3E3A39] text-xl shadow-sm group-hover/input:border-[#B78D7D]/30"
                  />
               </div>
            </div>

            <div className="p-10 bg-[#B78D7D]/5 rounded-[3rem] border border-[#B78D7D]/10 flex items-center gap-8 shadow-inner group/info hover:border-[#B78D7D]/30 transition-all duration-700 relative">
               <ShieldCheck size={40} className="text-emerald-500 shrink-0" />
               <p className="text-[11px] font-black text-[#8E7A70] leading-relaxed uppercase tracking-[0.1em] font-mono">Your information is safe with us.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-10 bg-[#B78D7D] text-white font-black text-[13px] rounded-[3rem] shadow-[0_25px_50px_rgba(183,141,125,0.3)] hover:bg-[#A37B6D] transition-all disabled:opacity-70 active:scale-[0.98] flex items-center justify-center gap-5 mt-14 border border-white/10 uppercase tracking-[0.5em] font-mono"
            >
              {loading ? (
                 <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Go to my account</span>
                  <ArrowRight size={24} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <p className="mt-20 text-center text-[#B2AAA6] font-black text-[11px] uppercase tracking-[0.4em] font-mono">
            Already have an account? <Link href="/login" className="text-[#B78D7D] hover:text-[#A37B6D] transition-all ml-3 underline decoration-[#B78D7D]/20">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
