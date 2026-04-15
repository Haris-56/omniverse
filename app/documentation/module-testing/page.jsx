import { CheckCircle, XCircle, Database, Server, Smartphone, Monitor, Hexagon, Activity, Zap, Cpu } from "lucide-react";

export default function ModuleTestingPage() {
  const tests = [
    { id: "MT-001", component: "Email Engine", desc: "Module standalone configurations", pre: "Run queue process", expected: "Email processing completely operates", status: "Pass" },
    { id: "MT-002", component: "Instagram Logic", desc: "Headless task handling", pre: "Valid session", expected: "Functions correctly at 85% capacity limits", status: "Pass" },
    { id: "MT-003", component: "LinkedIn Login", desc: "Initial credential handling automation", pre: "Browser boot", expected: "Authenticates sessions appropriately", status: "Pass" },
    { id: "MT-004", component: "Facebook Module", desc: "Orchestrate FB sequences independently", pre: "Campaign set", expected: "Runs sequences without catastrophic crashing", status: "Fail" },
    { id: "MT-005", component: "AI Creator / Closer", desc: "Format generation with external AI APIs", pre: "System Persona data", expected: "Appropriately formats and generates prompts", status: "Fail" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-32 font-sans">
      
      {/* Header Sector */}
      <div className="border-b border-[#B78D7D]/15 pb-12 relative">
        <div className="absolute -left-8 top-1.5 w-1.5 h-12 bg-[#B78D7D] rounded-full shadow-sm"></div>
        <h1 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">Module_<span className="text-[#B78D7D]">Testing</span></h1>
        <p className="text-[#8E7A70] mt-4 text-xl font-bold leading-relaxed max-w-3xl italic">
          Domain-level validation determining functional soundness of independent engines without the entire backend context running.
        </p>
      </div>

      <div className="bg-white rounded-[4rem] border border-[#B78D7D]/10 p-10 lg:p-16 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#B78D7D]/20 to-transparent" />
        
        <h2 className="text-2xl font-black text-[#3E3A39] mb-12 tracking-tight relative z-10 flex items-center gap-4 uppercase leading-none">
          <Database size={32} className="text-[#B78D7D]" /> Mock_Environment_Architecture
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-14 relative z-10 py-6">
           {/* Mock Data Entry */}
           <div className="p-8 rounded-[2.5rem] bg-[#F8F4F2]/50 border border-[#B78D7D]/15 flex flex-col items-center gap-5 w-56 shadow-inner group/card hover:bg-white transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center border border-[#B78D7D]/10 shadow-sm group-hover/card:rotate-12 transition-transform">
                <Database className="text-[#B78D7D]" size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2AAA6] font-mono italic">Mock_Data::Sinon</span>
           </div>
           
           <div className="w-16 h-0.5 bg-gradient-to-r from-[#B78D7D]/30 to-transparent border-t border-dashed border-[#B78D7D]/30 hidden lg:block"></div>

           {/* Core Execution Module */}
           <div className="p-10 rounded-[3rem] bg-white border border-[#B78D7D]/20 flex flex-col items-center gap-6 shadow-xl relative group/engine hover:-translate-y-2 transition-all duration-700">
               <div className="absolute inset-x-0 -top-px h-[2px] w-full bg-gradient-to-r from-transparent via-[#B78D7D] to-transparent"></div>
               <div className="p-6 rounded-full bg-[#B78D7D] text-white shadow-lg shadow-[#B78D7D]/20">
                  <Server size={40} />
               </div>
               <span className="text-lg font-black text-[#3E3A39] uppercase tracking-tighter text-center leading-tight font-sans italic">Engine_Instance<br/><span className="text-[10px] text-[#B2AAA6] font-mono tracking-[0.3em] font-black opacity-60 not-italic">(LNKD_NODE, FB_PROTOCOL)</span></span>
           </div>

           <div className="w-16 h-0.5 bg-gradient-to-l from-[#B78D7D]/30 to-transparent border-t border-dashed border-[#B78D7D]/30 hidden lg:block"></div>
           
           <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#F8F4F2] border border-[#B78D7D]/10 shadow-sm">
                 <CheckCircle size={20} className="text-emerald-500" /> <span className="text-[11px] font-black font-mono text-[#5E5A59] tracking-widest leading-none">EXPECT(CALLS).TOBE(20)</span>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#F8F4F2] border border-[#B78D7D]/10 shadow-sm">
                 <CheckCircle size={20} className="text-emerald-500" /> <span className="text-[11px] font-black font-mono text-[#5E5A59] tracking-widest leading-none">EXPECT(ERROR).TOBE_NULL()</span>
              </div>
           </div>
        </div>

        <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="space-y-10">
        <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none flex items-center gap-4">
           <Zap size={28} className="text-[#B78D7D]" /> Execution_Matrix
        </h2>
        <div className="overflow-hidden rounded-[3.5rem] border border-[#B78D7D]/15 bg-white shadow-xl relative group">
          <table className="w-full text-left text-sm text-[#3E3A39]">
            <thead className="bg-[#F8F4F2]/50 text-[10px] uppercase text-[#B2AAA6] tracking-[0.5em] border-b border-[#B78D7D]/10 font-mono">
              <tr>
                <th className="px-8 py-8 font-black">Test_ID</th>
                <th className="px-8 py-8 font-black">Target_Module</th>
                <th className="px-8 py-8 font-black">Architecture_Description</th>
                <th className="px-8 py-8 font-black">Expected_Resonance</th>
                <th className="px-8 py-8 font-black w-40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B78D7D]/5 relative z-10">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-[#F8F4F2]/30 transition-all group/row duration-500">
                  <td className="px-8 py-8 whitespace-nowrap font-black text-[#B78D7D] font-mono text-[12px] group-hover/row:translate-x-1 transition-transform">{t.id}</td>
                  <td className="px-8 py-8">
                      <span className="font-black font-mono text-[10px] text-[#B78D7D] bg-[#F8F4F2] border border-[#B78D7D]/15 rounded-xl px-4 py-2 uppercase tracking-widest shadow-inner leading-none">{t.component}</span>
                  </td>
                  <td className="px-8 py-8 text-[#5E5A59] font-bold leading-relaxed italic">{t.desc}</td>
                  <td className="px-8 py-8 text-[#B2AAA6] font-black text-[10px] leading-relaxed font-mono tracking-widest uppercase">{t.expected}</td>
                  <td className="px-8 py-8">
                    {t.status === "Pass" ? (
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm font-mono leading-none transition-all group-hover/row:bg-emerald-500 group-hover/row:text-white">
                            <CheckCircle size={14} /> Pass
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[#F8F4F2] text-[#B2AAA6] border border-[#B78D7D]/10 shadow-sm font-mono leading-none">
                            <Activity size={14} className="animate-pulse" /> Wait
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </div>

       {/* Global Branding Watermark */}
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
         <div className="flex flex-col items-end gap-10">
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#B78D7D]">MODULE</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#B78D7D]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#B78D7D] font-mono">STANDALONE_OPS</p>
            </div>
         </div>
      </div>
    </div>
  );
}
