import { ArrowRight, ShieldCheck, Zap, Globe, Cpu, Database, BookOpen, Code, Layers, Layout, Share2 } from "lucide-react";
import Link from "next/link";

export default function DocumentationHome() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans pb-32">
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#B78D7D]/10 border border-[#B78D7D]/20 text-[#B78D7D] text-[10px] font-black tracking-[0.3em] uppercase font-mono">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B78D7D] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B78D7D]"></span>
        </span>
        Project_Implementation_Atlas
      </div>
      
      <div className="space-y-8">
        <h1 className="text-7xl font-black text-[#3E3A39] tracking-tighter leading-none max-w-5xl uppercase">
          Architectural <span className="text-[#B78D7D]">Orchestration</span>
        </h1>
        <p className="text-2xl text-[#8E7A70] leading-relaxed max-w-3xl font-medium italic">
          Comprehensive implementation mapping, algorithmic hierarchies, and orchestration protocols for the Omniverse ecosystem.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
        {[
          { title: "Algorithms", desc: "Logic flows and pattern recognition matrices.", path: "/documentation/algorithm", icon: Cpu, accent: "#B78D7D" },
          { title: "External APIs", desc: "Interface definitions and protocol documentation.", path: "/documentation/external-apis", icon: Share2, accent: "#B78D7D" },
          { title: "User Interface", desc: "Design system semantics and visual hierarchy.", path: "/documentation/user-interface", icon: Layout, accent: "#B78D7D" },
          { title: "Unit Testing", desc: "Isolated functional testing of core utilities.", path: "/documentation/unit-testing", icon: Code, accent: "#B78D7D" },
          { title: "Module Testing", desc: "Domain-level validation for automation engines.", path: "/documentation/module-testing", icon: Zap, accent: "#B78D7D" },
          { title: "System Testing", desc: "Under-load stress and proxy evasion tests.", path: "/documentation/system-testing", icon: Database, accent: "#B78D7D" },
        ].map((item, i) => (
          <Link key={i} href={item.path}>
            <div className="group floating-glass relative p-12 rounded-[4rem] overflow-hidden hover:-translate-y-2 transition-all duration-700 cursor-pointer h-full flex flex-col justify-between border-[#B78D7D]/10">
              <div className="absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full bg-[#B78D7D]"></div>
              
              <div>
                 <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 border border-[#B78D7D]/10 bg-white shadow-sm transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                    <item.icon size={32} className="text-[#B78D7D]" />
                 </div>
                 <h3 className="text-2xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase">{item.title}</h3>
                 <p className="text-[#8E7A70] font-medium leading-relaxed">{item.desc}</p>
              </div>
              
              <div className="mt-10 flex items-center justify-between text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] group-hover:text-[#B78D7D] transition-colors font-mono">
                 <span>Explore_Matrix</span>
                 <ArrowRight size={18} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>

              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
