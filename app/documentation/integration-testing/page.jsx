import { CheckCircle, XCircle, ArrowRightLeft, Layers, Hexagon, Activity, Zap, Database, Server } from "lucide-react";

export default function IntegrationTestingPage() {
  const tests = [
    { id: "IT-001", component: "Auth Session -> DB", desc: "Verifying secure Better-Auth authentication", pre: "Login payload", expected: "Session token maps 100% accurately", status: "Pass" },
    { id: "IT-002", component: "Contacts -> DB", desc: "Bridging contact imports to module", pre: "Upload lists / CSV", expected: "Map and insert contacts robustly 100%", status: "Pass" },
    { id: "IT-003", component: "Email -> Scheduler", desc: "Integrates timers successfully to jobs", pre: "Valid node intervals", expected: "Triggers accurately without messing loops", status: "Fail" },
    { id: "IT-004", component: "IG Tasks -> Scheduler", desc: "Pushing IG tasks on automation timers", pre: "Task wait state", expected: "Integrates to system queues properly", status: "Fail" },
    { id: "IT-005", component: "Sys-Admin -> Logs", desc: "Passing SaaS execution streams safely", pre: "Workers live data", expected: "Populates current executions perfectly", status: "Fail" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-32 font-sans">
      
      {/* Header Sector */}
      <div className="border-b border-[#8245EF]/15 pb-12 relative">
        <div className="absolute -left-8 top-1.5 w-1.5 h-12 bg-[#8245EF] rounded-full shadow-sm"></div>
        <h1 className="text-5xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Integration_<span className="text-[#8245EF]">Testing</span></h1>
        <p className="text-[#64748b] mt-4 text-xl font-bold leading-relaxed max-w-3xl italic">
          Validates perfect communication scaling between independent macro layers (Next.js to MongoDB, Node Scheduler to Redis Backend).
        </p>
      </div>

      <div className="bg-white rounded-[4rem] border border-[#8245EF]/10 p-10 lg:p-16 shadow-lg overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-40 bg-[#8245EF]/5 blur-3xl rounded-full group-hover:bg-[#8245EF]/10 transition-colors duration-1000"></div>
        
        <h2 className="text-2xl font-black text-[#161932] mb-12 tracking-tight relative z-10 flex items-center gap-4 uppercase leading-none">
          <Layers size={32} className="text-[#8245EF]" /> Pipeline_Bridging_Blueprint
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
           <div className="bg-[#FCF8FE] p-10 rounded-[3rem] border border-[#8245EF]/10 shadow-inner group/card hover:bg-white transition-all duration-500">
              <div className="text-[10px] font-black text-[#94a3b8] tracking-[0.4em] mb-6 font-mono italic uppercase">LAYER 01 (REQUEST)</div>
              <div className="space-y-4">
                 <div className="p-6 bg-white rounded-2xl border border-[#8245EF]/10 text-[#161932] font-black text-sm shadow-sm hover:border-[#8245EF]/30 transition-all font-sans italic">
                   Next.js_Route_Handlers
                 </div>
                 <div className="p-6 bg-white rounded-2xl border border-[#8245EF]/10 text-[#161932] font-black text-sm shadow-sm hover:border-[#8245EF]/30 transition-all font-sans italic">
                   Background_Schedulers
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-pulse cursor-default px-10 py-4 bg-[#8245EF] rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 shadow-[0_20px_40px_rgba(130, 69, 239,0.2)] font-mono">
                 Data_Payload <ArrowRightLeft size={16} />
              </div>
              <div className="h-24 w-[2px] bg-gradient-to-b from-transparent via-[#8245EF]/40 to-transparent mt-6"></div>
           </div>

           <div className="bg-[#FCF8FE] p-10 rounded-[3rem] border border-[#8245EF]/10 shadow-inner group/card hover:bg-white transition-all duration-500">
              <div className="text-[10px] font-black text-[#94a3b8] tracking-[0.4em] mb-6 font-mono italic uppercase">LAYER 02 (INFRASTRUCTURE)</div>
              <div className="space-y-4">
                 <div className="p-6 bg-white rounded-2xl border border-[#8245EF]/10 text-[#161932] font-black text-sm shadow-sm hover:border-[#8245EF]/30 transition-all font-sans italic flex justify-between">
                   <span>MongoDB_Atlas_Base</span>
                 </div>
                 <div className="p-6 bg-white rounded-2xl border border-[#8245EF]/10 text-[#161932] font-black text-sm shadow-sm hover:border-[#8245EF]/30 transition-all font-sans italic">
                   Redis_/_BullMQ_Queue
                 </div>
              </div>
           </div>
        </div>

        <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none flex items-center gap-4">
               <Zap size={28} className="text-[#8245EF]" /> Execution_Matrix
            </h2>
            <div className="px-6 py-2 rounded-full bg-[#FCF8FE] border border-[#8245EF]/10 text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono italic">
               {tests.length} Dependency Units
            </div>
        </div>

        <div className="overflow-hidden rounded-[3.5rem] border border-[#8245EF]/15 bg-white shadow-xl relative group">
          <table className="w-full text-left text-sm text-[#161932]">
            <thead className="bg-[#FCF8FE]/50 text-[10px] uppercase text-[#94a3b8] tracking-[0.5em] border-b border-[#8245EF]/10 font-mono">
              <tr>
                <th className="px-8 py-8 font-black">Test_ID</th>
                <th className="px-8 py-8 font-black">Dependency_Map</th>
                <th className="px-8 py-8 font-black">Architecture_Description</th>
                <th className="px-8 py-8 font-black">Expected_Resonance</th>
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
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 shadow-sm font-mono leading-none">
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
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#8245EF]">INTEGRATE</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#8245EF]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#8245EF] font-mono">PIPELINE_ORB</p>
            </div>
         </div>
      </div>
    </div>
  );
}
