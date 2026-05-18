"use client";

import { HelpCircle, MessageSquare, BookOpen, ShieldCheck, Mail, ArrowRight, Zap, Cpu, Activity, Globe, Hexagon } from "lucide-react";

export default function SupportPage() {
  const options = [
    {
      title: "Documentation",
      desc: "Read our guides to learn how to use the platform effectively.",
      icon: BookOpen,
      link: "/documentation",
      color: "text-[#8245EF] border-[#8245EF]/15 bg-[#8245EF]/5",
      glow: "copper"
    },
    {
      title: "System Status",
      desc: "Check the real-time status of our services and network.",
      icon: ShieldCheck,
      link: "/documentation/system-testing",
      color: "text-emerald-500 border-emerald-500/15 bg-emerald-500/5",
      glow: "emerald"
    },
    {
      title: "Contact Support",
      desc: "Get in touch with our support team for help and troubleshooting.",
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
         <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-50 border border-green-100 rounded-full text-green-600 font-bold text-[10px] uppercase tracking-widest mb-4">
               <span className="w-2 h-2 bg-green-500 rounded-full" />
               Support Center
            </div>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight">Help & Support</h1>
            <p className="text-gray-500 text-xl max-w-4xl mx-auto leading-relaxed font-medium">
              Find helpful guides, check system status, or contact our support team for help.
            </p>
         </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {options.map((opt, idx) => (
             <div key={idx} className="group bg-white border border-[#8245EF]/10 rounded-[4.5rem] p-12 hover:shadow-[0_45px_90px_rgba(130, 69, 239,0.08)] transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-3">
                <div className={`absolute inset-0 bg-gradient-to-br from-[#8245EF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                
                <div className="relative z-10 w-full flex flex-col items-center">
                   <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border border-[#8245EF]/10 group-hover:bg-white group-hover:border-[#8245EF]/30 ${opt.color}`}>
                      <opt.icon size={36} />
                   </div>
                   <div className="space-y-4 mb-8 flex-1">
                       <h3 className="text-xl font-bold text-gray-900 tracking-tight uppercase leading-none">{opt.title}</h3>
                       <p className="text-gray-500 text-base font-medium leading-relaxed">{opt.desc}</p>
                    </div>
                    
                    <a 
                      href={opt.link}
                      className="w-full py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 text-[10px] font-bold uppercase tracking-widest group-hover:text-white group-hover:bg-[#8245EF] group-hover:border-transparent transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                    >
                      Open <ArrowRight size={16} />
                    </a>
                </div>

                <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             </div>
           ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-white border border-[#8245EF]/15 rounded-[5rem] p-20 text-center relative overflow-hidden group shadow-lg">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.01] pointer-events-none" />
           <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#8245EF]/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
           <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#8245EF]/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
           <div className="relative z-10 flex flex-col items-center space-y-8">
               <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 text-[#8245EF] flex items-center justify-center">
                  <Mail size={40} className="animate-pulse" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-gray-900 tracking-tight uppercase">Email Support</h2>
                  <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">Have a specific question or need direct help? Send us an email and we'll get back to you.</p>
               </div>
               <a href="mailto:support@omniverse.ai" className="px-12 py-5 bg-[#8245EF] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg hover:scale-105 active:scale-95 border border-white/10">
                  support@omniverse.ai
               </a>
            </div>
        </div>
      </div>
      
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
          <div className="flex flex-col items-end gap-6">
             <h1 className="text-[12rem] font-bold tracking-tighter uppercase leading-none text-[#8245EF]">HELP</h1>
             <div className="flex items-center gap-6">
                <Hexagon size={60} strokeWidth={2} className="text-[#8245EF]" />
                <p className="text-3xl font-bold uppercase tracking-widest text-[#8245EF]">SUPPORT</p>
             </div>
          </div>
       </div>
    </div>
  );
}
