import { CheckCircle, XCircle, Hexagon, Zap, Cpu, Activity, Database, ShieldCheck } from "lucide-react";

export default function UnitTestingPage() {
  const tests = [
    { id: "UT-001", component: "Database Interactions", desc: "Global database driver integrity per-module", pre: "System booted", expected: "DB operates at 100% fine natively", status: "Pass" },
    { id: "UT-002", component: "Responsive Layouts", desc: "Cross-device CSS framework constraints", pre: "Tailwind sizing", expected: "UI handles dynamic screen dimensions 100%", status: "Pass" },
    { id: "UT-003", component: "Dashboard.jsx", desc: "Static overview interface rendering", pre: "Login resolved", expected: "Dashboard components mount smoothly (static)", status: "Pass" },
    { id: "UT-004", component: "encryption.js", desc: "Test valid secure payload handling", pre: "AUTH_SECRET given", expected: "Strings encrypt successfully", status: "Pass" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-32 font-sans">
      
      {/* Header Sector */}
      <div className="border-b border-[#8245EF]/15 pb-12 relative">
        <div className="absolute -left-8 top-1.5 w-1.5 h-12 bg-[#8245EF] rounded-full shadow-sm"></div>
        <h1 className="text-5xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Unit_<span className="text-[#8245EF]">Testing</span></h1>
        <p className="text-[#64748b] mt-4 text-xl font-bold leading-relaxed max-w-3xl italic">
          Validating isolated functions, components, and core utilities inside the internal architectural boundaries.
        </p>
      </div>

      {/* Visual Execution Logic */}
      <div className="bg-white rounded-[4rem] border border-[#8245EF]/10 p-10 lg:p-16 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8245EF]/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <h2 className="text-2xl font-black text-[#161932] mb-12 tracking-tight relative z-10 flex items-center gap-4 uppercase leading-none">
          <Activity size={32} className="text-[#8245EF] animate-pulse" /> Data_Execution_Flow
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-14 relative z-10">
           <div className="flex flex-col items-center gap-5 group/node">
              <div className="h-24 w-24 rounded-3xl bg-[#FCF8FE] flex items-center justify-center border border-[#8245EF]/15 group-hover/node:bg-[#8245EF] group-hover/node:text-white transition-all duration-700 shadow-inner group-hover/node:shadow-[0_20px_40px_rgba(130, 69, 239,0.2)] group-hover/node:rotate-6">
                  <span className="font-black text-2xl font-mono text-[#8245EF] group-hover/node:text-white">Jest</span>
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] text-[#94a3b8] uppercase font-mono italic">Test_Runner</span>
           </div>
           
           <div className="h-[2px] w-12 lg:w-28 bg-gradient-to-r from-[#8245EF]/30 to-[#8245EF]/10"></div>
           
           <div className="flex flex-col gap-5">
               <div className="px-10 py-5 rounded-2xl bg-[#FCF8FE] border border-[#8245EF]/10 text-[#161932] font-black text-sm shadow-sm hover:border-[#8245EF]/40 transition-all uppercase tracking-tighter italic">
                  lib/ Utilities_Config
               </div>
               <div className="px-10 py-5 rounded-2xl bg-[#FCF8FE] border border-[#8245EF]/10 text-[#161932] font-black text-sm shadow-sm hover:border-[#8245EF]/40 transition-all uppercase tracking-tighter italic">
                  UI_Components_Node
               </div>
           </div>
           
           <div className="h-[2px] w-12 lg:w-28 bg-gradient-to-r from-[#8245EF]/10 to-emerald-500/20"></div>
           
           <div className="flex flex-col items-center gap-5 group/node">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center border border-emerald-500/20 group-hover/node:border-emerald-500 group-hover/node:scale-110 transition-all duration-700 shadow-lg group-hover/node:shadow-[0_20px_40px_rgba(16,185,129,0.15)]">
                  <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] text-[#94a3b8] uppercase font-mono italic">Assertions</span>
           </div>
        </div>

        <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Styled Table Sector */}
      <div className="space-y-10">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none flex items-center gap-4">
               <Zap size={28} className="text-[#8245EF]" /> Execution_Matrix
            </h2>
            <div className="px-6 py-2 rounded-full bg-[#FCF8FE] border border-[#8245EF]/10 text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono italic shadow-inner">
               {tests.length} Target Scenarios
            </div>
        </div>

        <div className="overflow-hidden rounded-[3.5rem] border border-[#8245EF]/15 bg-white shadow-xl relative group">
          <table className="w-full text-left text-sm text-[#161932]">
            <thead className="bg-[#FCF8FE]/50 text-[10px] uppercase text-[#94a3b8] tracking-[0.5em] border-b border-[#8245EF]/10 font-mono">
              <tr>
                <th className="px-8 py-8 font-black">Test_ID</th>
                <th className="px-8 py-8 font-black">Target_Component</th>
                <th className="px-8 py-8 font-black">Description_Protocol</th>
                <th className="px-8 py-8 font-black">Expected_Resonance</th>
                <th className="px-8 py-8 font-black w-40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8245EF]/5 relative z-10">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-[#FCF8FE]/30 transition-all group/row duration-500">
                  <td className="px-8 py-8 whitespace-nowrap font-black text-[#8245EF] font-mono text-[12px] group-hover/row:translate-x-1 transition-transform">{t.id}</td>
                  <td className="px-8 py-8">
                      <span className="font-black font-mono text-[10px] text-[#8245EF] bg-[#FCF8FE] border border-[#8245EF]/15 rounded-xl px-4 py-2 uppercase tracking-widest shadow-inner leading-none">{t.component}</span>
                  </td>
                  <td className="px-8 py-8 text-[#5E5A59] font-bold leading-relaxed italic">{t.desc}</td>
                  <td className="px-8 py-8 text-[#94a3b8] font-black text-[10px] leading-relaxed font-mono tracking-widest uppercase">{t.expected}</td>
                  <td className="px-8 py-8">
                    <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm font-mono leading-none transition-all group-hover/row:bg-emerald-500 group-hover/row:text-white">
                        <CheckCircle size={14} /> Pass
                    </span>
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
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#8245EF]">UNIT</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#8245EF]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#8245EF] font-mono">CORE_VALIDATION</p>
            </div>
         </div>
      </div>
    </div>
  );
}
