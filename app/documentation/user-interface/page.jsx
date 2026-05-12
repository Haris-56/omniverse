import { LayoutTemplate, Palette, Type, Smartphone, Box, Layers, Zap, MousePointerClick, Hexagon } from "lucide-react";

export default function UserInterfacePage() {
  const principles = [
    {
      title: "Copper Harmony Palette",
      desc: "A premium neutral palette (hex: #FCF8FE) designed for surgical clarity and aesthetic warmth.",
      icon: Palette
    },
    {
      title: "Tan Accent Tokens",
      desc: "Earth-tone highlights (hex: #8245EF) provide directional focus and interactive affordance.",
      icon: Layers
    },
    {
      title: "Tactile Typography",
      desc: "Outfit for headings (dynamic tracking) and Inter for body text (readability focus) across all viewports.",
      icon: Type
    },
    {
      title: "Micro-Interactions",
      desc: "Cubic-bezier transitions and physics-based scaling on all interactive elements for a premium feel.",
      icon: Zap
    }
  ];

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-40 font-sans">
      <div className="border-b border-[#8245EF]/10 pb-16 relative">
        <div className="flex items-center gap-3 mb-6">
           <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#8245EF]/20 flex items-center gap-3 font-mono">
             <Hexagon size={16} className="opacity-80" />
             Design_System::Semantics
           </span>
        </div>
        <h1 className="text-7xl font-black text-[#161932] tracking-tighter uppercase leading-none">
          User <span className="text-[#8245EF]">Interface</span>
        </h1>
        <p className="text-[#64748b] mt-8 text-2xl leading-relaxed max-w-3xl font-medium italic">Design language and architectural frontend principles for the Omniverse platform.</p>
      </div>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-8 py-3 bg-[#8245EF]/5 border border-[#8245EF]/10 rounded-full w-fit">
           <LayoutTemplate size={18} className="text-[#8245EF]" />
           <span className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] font-mono">5.3.1 Design Philosophy</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {principles.map((p, idx) => (
             <div key={idx} className="group floating-glass rounded-[4rem] p-12 relative overflow-hidden transition-all duration-700 border-[#8245EF]/10">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full bg-[#8245EF]"></div>
                
                <div className="flex items-center gap-8 mb-10 relative z-10">
                   <div className="w-20 h-20 rounded-[1.75rem] bg-[#FCF8FE] border border-[#8245EF]/10 flex items-center justify-center text-[#8245EF] shadow-sm transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                      <p.icon size={36} />
                   </div>
                   <div className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono">Token_System</div>
                </div>
                
                <h3 className="text-3xl font-black text-[#161932] mb-4 tracking-tighter uppercase relative z-10">{p.title}</h3>
                <p className="text-[#64748b] text-xl leading-relaxed relative z-10 font-bold italic group-hover:text-[#161932] transition-colors">
                  "{p.desc}"
                </p>
             </div>
           ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-8 py-3 bg-[#8245EF]/5 border border-[#8245EF]/10 rounded-full w-fit">
           <Smartphone size={18} className="text-[#8245EF]" />
           <span className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] font-mono">5.3.2 Responsive Orchestration</span>
        </div>

        <div className="bg-white rounded-[4rem] border border-[#8245EF]/15 p-16 shadow-lg relative overflow-hidden flex flex-col items-center group">
           <div className="flex items-end gap-6 h-64 mb-12 w-full justify-center">
              <div className="w-16 bg-[#8245EF]/10 border border-[#8245EF]/20 rounded-t-2xl h-full animate-in slide-in-from-bottom duration-700 group-hover:bg-[#8245EF] transition-all shadow-sm" />
              <div className="w-16 bg-[#8245EF]/10 border border-[#8245EF]/20 rounded-t-2xl h-[80%] animate-in slide-in-from-bottom delay-100 duration-700 group-hover:bg-[#8245EF] transition-all shadow-sm" />
              <div className="w-16 bg-[#8245EF]/10 border border-[#8245EF]/20 rounded-t-2xl h-[95%] animate-in slide-in-from-bottom delay-200 duration-700 group-hover:bg-[#8245EF] transition-all shadow-sm" />
              <div className="w-16 bg-[#8245EF]/10 border border-[#8245EF]/20 rounded-t-2xl h-[60%] animate-in slide-in-from-bottom delay-300 duration-700 group-hover:bg-[#8245EF] transition-all shadow-sm" />
           </div>
           <p className="text-[#64748b] font-bold italic text-center max-w-xl text-lg">
             Our UI engine utilizes a dynamic breakpoint system that re-flows visual clusters based on the device's aspect ratio, ensuring 100% mission availability on mobile and desktop units.
           </p>
        </div>
      </section>
    </div>
  );
}
