import { CheckCircle, XCircle, MousePointerClick, ChevronRight, Hexagon, Activity, Zap, Monitor, Globe } from "lucide-react";

export default function FunctionalTestingPage() {
  const tests = [
    { id: "FT-001", component: "Core Visual UIs", desc: "Testing all general UI/Nav logic", pre: "General browsing", expected: "UI operates flawlessly entirely across devices", status: "Pass" },
    { id: "FT-002", component: "Authorization Rules", desc: "Testing admin vs user role UI gating", pre: "Switch user roles", expected: "100% protects unauthorized paths successfully", status: "Pass" },
    { id: "FT-003", component: "Email Campaign", desc: "Full Campaign end-to-end operation", pre: "Load Visual nodes", expected: "Sends precisely following visual layout", status: "Pending" },
    { id: "FT-004", component: "LinkedIn Usage", desc: "E2E testing full LinkedIn capability workflows", pre: "Login bypassed", expected: "Executes automation nodes heavily", status: "Pending" },
    { id: "FT-005", component: "Support Pages", desc: "Help systems and tool documentation nav", pre: "Click /support", expected: "Provides loaded functional instructions", status: "Fail" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-32 font-sans">
      
      {/* Header Sector */}
      <div className="border-b border-[#8245EF]/15 pb-12 relative">
        <div className="absolute -left-8 top-1.5 w-1.5 h-12 bg-[#8245EF] rounded-full shadow-sm"></div>
        <h1 className="text-5xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Functional_<span className="text-[#8245EF]">Testing</span></h1>
        <p className="text-[#64748b] mt-4 text-xl font-bold leading-relaxed max-w-3xl italic">
          End-to-End operations ensuring complex UI combinations and features work cohesively within the Omniverse ecosystem.
        </p>
      </div>

      {/* Emulation Path Sector */}
      <div className="bg-white rounded-[4rem] border border-[#8245EF]/10 p-10 lg:p-16 shadow-lg overflow-hidden relative group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#8245EF]/30 to-transparent" />
        
        <h2 className="text-2xl font-black text-[#161932] mb-12 tracking-tight relative z-10 flex items-center gap-4 uppercase leading-none">
          <MousePointerClick size={32} className="text-[#8245EF]" /> Playwright_Emulation_Path 
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full max-w-5xl mx-auto py-8">
            {/* Step 1 */}
            <div className="bg-[#FCF8FE] p-8 rounded-[2.5rem] border border-[#8245EF]/10 shadow-inner text-center flex-1 w-full group/step hover:bg-white transition-all duration-500">
               <div className="w-12 h-12 rounded-full bg-white border border-[#8245EF]/20 flex items-center justify-center font-black text-[#8245EF] mx-auto mb-6 shadow-sm group-hover/step:scale-110 transition-transform font-mono text-xl">1</div>
               <div className="text-lg font-black text-[#161932] mb-2 uppercase leading-none">Launch_Config</div>
               <div className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3em] font-mono italic">CHROME_HEADLESS</div>
            </div>

            <ChevronRight className="text-[#8245EF]/30 w-10 h-10 hidden md:block" />

            {/* Step 2 */}
            <div className="bg-[#FCF8FE] p-8 rounded-[2.5rem] border border-[#8245EF]/10 shadow-inner text-center flex-1 w-full group/step hover:bg-white transition-all duration-500">
               <div className="w-12 h-12 rounded-full bg-white border border-[#8245EF]/20 flex items-center justify-center font-black text-[#8245EF] mx-auto mb-6 shadow-sm group-hover/step:scale-110 transition-transform font-mono text-xl">2</div>
               <div className="text-lg font-black text-[#161932] mb-2 uppercase leading-none">Navigate_Click</div>
               <div className="text-[10px] text-[#94a3b8] uppercase tracking-[0.3em] font-mono italic">SEQ_BUILDER_NODE</div>
            </div>

            <ChevronRight className="text-[#8245EF]/30 w-10 h-10 hidden md:block" />

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#8245EF] shadow-xl text-center flex-1 w-full group/step relative group/active">
               <div className="absolute inset-0 bg-[#8245EF]/5 opacity-50" />
               <div className="w-12 h-12 rounded-full bg-[#8245EF] border-2 border-white flex items-center justify-center font-black text-white mx-auto mb-6 shadow-lg relative z-10 font-mono text-xl">3</div>
               <div className="text-lg font-black text-[#161932] mb-2 uppercase leading-none relative z-10">Expect_Visible</div>
               <div className="text-[10px] text-[#8245EF] uppercase tracking-[0.3em] font-mono italic relative z-10">DOM_VALIDATION</div>
            </div>
        </div>

        <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="space-y-10">
        <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none flex items-center gap-4">
           <Zap size={28} className="text-[#8245EF]" /> Execution_Matrix
        </h2>
        <div className="overflow-hidden rounded-[3.5rem] border border-[#8245EF]/15 bg-white shadow-xl relative group">
          <table className="w-full text-left text-sm text-[#161932]">
            <thead className="bg-[#FCF8FE]/50 text-[10px] uppercase text-[#94a3b8] tracking-[0.5em] border-b border-[#8245EF]/10 font-mono">
              <tr>
                <th className="px-8 py-8 font-black">Test_ID</th>
                <th className="px-8 py-8 font-black">Playwright_Scope</th>
                <th className="px-8 py-8 font-black">Architecture_Description</th>
                <th className="px-8 py-8 font-black">Expected_DOM_Impact</th>
                <th className="px-8 py-8 font-black w-40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8245EF]/5 relative z-10">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-[#FCF8FE]/30 transition-all group/row duration-500">
                  <td className="px-8 py-8 whitespace-nowrap font-black text-[#8245EF] font-mono text-[12px] group-hover/row:translate-x-1 transition-transform">{t.id}</td>
                  <td className="px-8 py-8">
                      <span className="font-black font-mono text-[10px] text-[#8245EF] bg-[#FCF8FE] border border-[#8245EF]/15 rounded-xl px-4 py-2 uppercase tracking-[0.2em] shadow-inner leading-none">{t.component}</span>
                  </td>
                  <td className="px-8 py-8 text-[#5E5A59] font-bold leading-relaxed italic">{t.desc}</td>
                  <td className="px-8 py-8 text-[#94a3b8] font-black text-[10px] leading-relaxed font-mono tracking-widest uppercase">{t.expected}</td>
                  <td className="px-8 py-8">
                    {t.status === "Pass" ? (
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm font-mono leading-none transition-all group-hover/row:bg-emerald-500 group-hover/row:text-white">
                            <CheckCircle size={14} /> Pass
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-[#FCF8FE] text-[#94a3b8] border border-[#8245EF]/10 shadow-sm font-mono leading-none transition-all">
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
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#8245EF]">FUNCTION</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#8245EF]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#8245EF] font-mono">E2E_SYNAPSE</p>
            </div>
         </div>
      </div>
    </div>
  );
}
