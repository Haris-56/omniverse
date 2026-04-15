"use client";

import { HelpCircle, MessageSquare, BookOpen, ShieldCheck, Mail, ArrowRight, Zap, Cpu, Activity, Globe, Hexagon } from "lucide-react";

export default function SupportPage() {
  const options = [
    {
      title: "Protocol_Docs",
      desc: "Access the full neural API references and system architecture guides for orchestration.",
      icon: BookOpen,
      link: "/documentation",
      color: "text-[#B78D7D] border-[#B78D7D]/15 bg-[#B78D7D]/5",
      glow: "copper"
    },
    {
      title: "Cluster_Vitals",
      desc: "Monitor real-time health metrics and latency telemetry of autonomous social nodes.",
      icon: ShieldCheck,
      link: "/documentation/system-testing",
      color: "text-emerald-500 border-emerald-500/15 bg-emerald-500/5",
      glow: "emerald"
    },
    {
      title: "Core_Support",
      desc: "Connect with bridge engineers for direct protocol calibration and troubleshooting.",
      icon: MessageSquare,
      link: "mailto:support@omniverse.ai",
      color: "text-amber-500 border-amber-500/15 bg-amber-500/5",
      glow: "amber"
    }
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 font-sans pb-32">
      <div className="max-w-[1300px] mx-auto py-12 space-y-24">
        
        {/* Header Sector */}
        <div className="text-center space-y-8">
           <div className="inline-flex items-center gap-4 px-8 py-3 bg-white border border-[#B78D7D]/15 rounded-full text-[#B2AAA6] font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-sm">
              <span className="w-2.5 h-2.5 bg-[#B78D7D] rounded-full animate-pulse shadow-[0_0_10px_rgba(183,141,125,0.4)]" />
              Intelligence_Hub_v4
           </div>
           <h1 className="text-7xl font-black text-[#3E3A39] tracking-tighter leading-tight uppercase">
             Coordinate_<span className="text-[#B78D7D]">Center</span>
           </h1>
           <p className="text-[#8E7A70] text-2xl max-w-4xl mx-auto leading-relaxed font-bold italic">
             Access distributed technical resources, monitor system health telemetry, or engage with core development for immediate node calibration.
           </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {options.map((opt, idx) => (
             <div key={idx} className="group bg-white border border-[#B78D7D]/10 rounded-[4.5rem] p-12 hover:shadow-[0_45px_90px_rgba(183,141,125,0.08)] transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-3">
                <div className={`absolute inset-0 bg-gradient-to-br from-[#B78D7D]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                
                <div className="relative z-10 w-full flex flex-col items-center">
                   <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border border-[#B78D7D]/10 group-hover:bg-white group-hover:border-[#B78D7D]/30 ${opt.color}`}>
                      <opt.icon size={36} />
                   </div>
                   
                   <div className="space-y-4 mb-12 flex-1">
                      <h3 className="text-2xl font-black text-[#3E3A39] tracking-tight uppercase leading-none">{opt.title}</h3>
                      <p className="text-[#8E7A70] text-base font-bold leading-relaxed italic">{opt.desc}</p>
                   </div>
                   
                   <a 
                     href={opt.link}
                     className="w-full py-5 bg-[#F8F4F2] border border-[#B78D7D]/10 rounded-[1.5rem] text-[#B2AAA6] text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-white group-hover:bg-[#B78D7D] group-hover:border-transparent transition-all font-mono active:scale-95 flex items-center justify-center gap-4 shadow-sm"
                   >
                     Initialize <ArrowRight size={18} />
                   </a>
                </div>

                <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             </div>
           ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-white border border-[#B78D7D]/15 rounded-[5rem] p-20 text-center relative overflow-hidden group shadow-lg">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.01] pointer-events-none" />
           <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#B78D7D]/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
           <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#B78D7D]/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
           
           <div className="relative z-10 flex flex-col items-center space-y-12">
              <div className="w-28 h-28 bg-[#F8F4F2]/50 rounded-[3rem] border border-[#B78D7D]/20 text-[#B78D7D] shadow-inner group-hover:rotate-12 transition-all duration-700 flex items-center justify-center">
                 <Mail size={56} className="animate-pulse" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-6xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Direct_Support_Bridge</h2>
                 <p className="text-[#8E7A70] text-2xl font-bold max-w-2xl mx-auto leading-relaxed italic">For sensitive protocol inquiries or partnership architectures, engage the core team directly via encrypted bridge.</p>
              </div>
              <a href="mailto:support@omniverse.ai" className="px-16 py-7 bg-[#B78D7D] text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-[2rem] hover:bg-[#A37B6D] transition-all shadow-[0_30px_60px_rgba(183,141,125,0.3)] hover:scale-105 active:scale-95 border border-white/10 font-mono">
                 support@omniverse.ai
              </a>
           </div>
        </div>
      </div>
      
       {/* Global Branding Watermark */}
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
         <div className="flex flex-col items-end gap-10">
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#B78D7D]">INFO_BASE</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#B78D7D]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#B78D7D] font-mono">CORE_PROTOCOL</p>
            </div>
         </div>
      </div>
    </div>
  );
}
