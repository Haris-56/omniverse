import { CheckCircle, XCircle, ShieldAlert, Cpu, Activity, Server, Radio, RefreshCcw, ShieldCheck, Database, Zap, Hexagon } from "lucide-react";

export default function SystemTestingPage() {
  const tests = [
    { id: "ST-001", component: "Global Encryption", desc: "AES-256-GCM encryption system efficacy test", pre: "Query DB native", expected: "Security algorithms working heavily 100%", status: "Pass" },
    { id: "ST-002", component: "Proxy IP Operations", desc: "IP masking system load scaling globally", pre: "Workers binding logic", expected: "Orchestrates traffic robustly mask", status: "Fail" },
    { id: "ST-003", component: "Admin Log Aggregator", desc: "Syncs SaaS execution telemetry actively", pre: "Live tasks processing", expected: "Logs execution correctly across servers", status: "Fail" },
    { id: "ST-004", component: "Advanced AI Nodes", desc: "Scale AI Creator / AI Closer models simultaneously", pre: "Bulk triggers", expected: "Sustains operational constraints natively", status: "Fail" },
    { id: "ST-005", component: "FB Node Load", desc: "Run FB orchestration actively on system", pre: "Active campaign run", expected: "Completes heavily without engine locks", status: "Fail" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-32 font-sans">
      
      {/* Header Sector */}
      <div className="border-b border-[#B78D7D]/15 pb-12 relative">
        <div className="absolute -left-8 top-1.5 w-1.5 h-12 bg-[#B78D7D] rounded-full shadow-sm"></div>
        <h1 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">System & Security_<span className="text-[#B78D7D]">Testing</span></h1>
        <p className="text-[#8E7A70] mt-4 text-xl font-bold leading-relaxed max-w-3xl italic">
          Comprehensive evaluation analyzing volumetric stress, proxy evasion stealth metrics, and encryption rigidity scaling.
        </p>
      </div>

      <div className="bg-white rounded-[4rem] border border-[#B78D7D]/10 p-10 lg:p-16 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B78D7D]/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <h2 className="text-2xl font-black text-[#3E3A39] mb-12 tracking-tight relative z-10 flex items-center gap-4 uppercase leading-none">
          <Activity size={32} className="text-[#B78D7D] animate-pulse" /> Infrastructure_Pressure_Map
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
           {/* Section 1: Security & Masking */}
           <div className="bg-[#F8F4F2]/50 border border-[#B78D7D]/10 p-10 rounded-[3rem] flex flex-col gap-8 shadow-inner group/card hover:bg-white transition-all duration-500">
              <div className="flex items-center gap-5 text-[#B78D7D] pb-6 border-b border-[#B78D7D]/10">
                 <ShieldCheck size={24} />
                 <h3 className="font-black text-[#3E3A39] uppercase tracking-[0.4em] text-[10px] font-mono">Security_&_Evasion</h3>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-[#B78D7D]/10 shadow-sm transition-all hover:border-[#B78D7D]/40 group/sub">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#F8F4F2] rounded-xl text-[#B78D7D] group-hover/sub:bg-[#B78D7D] group-hover/sub:text-white transition-all shadow-inner"><Radio size={18} /></div>
                    <span className="text-[12px] font-black text-[#3E3A39] font-mono tracking-tighter">PLAYWRIGHT::EXTRA</span>
                 </div>
                 <div className="text-[9px] uppercase font-black text-[#B2AAA6] tracking-[0.3em] font-mono italic">CreepJS Evasion</div>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-[#B78D7D]/10 shadow-sm transition-all hover:border-[#B78D7D]/40 group/sub">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#F8F4F2] rounded-xl text-[#B78D7D] group-hover/sub:bg-[#B78D7D] group-hover/sub:text-white transition-all shadow-inner"><ShieldAlert size={18} /></div>
                    <span className="text-[12px] font-black text-[#3E3A39] font-mono tracking-tighter">AES-256-GCM_AUTH</span>
                 </div>
                 <div className="text-[9px] uppercase font-black text-[#B2AAA6] tracking-[0.3em] font-mono italic">MongoDB Native</div>
              </div>
           </div>

           {/* Section 2: Load Simulation */}
           <div className="bg-[#F8F4F2]/50 border border-[#B78D7D]/10 p-10 rounded-[3rem] flex flex-col gap-8 shadow-inner group/card hover:bg-white transition-all duration-500">
              <div className="flex items-center gap-5 text-[#B78D7D] pb-6 border-b border-[#B78D7D]/10">
                 <Cpu size={24} />
                 <h3 className="font-black text-[#3E3A39] uppercase tracking-[0.4em] text-[10px] font-mono">Load_Simulation_Matrix</h3>
              </div>
              
              <div className="flex flex-col gap-0 shadow-sm rounded-[2rem] overflow-hidden border border-[#B78D7D]/10">
                <div className="flex items-center justify-between p-5 bg-white border-b border-[#B78D7D]/5 text-[11px] font-black text-[#3E3A39] font-mono uppercase tracking-widest">
                   <span className="flex items-center gap-3"><Server size={14} className="text-[#B78D7D]" /> 50,000 Queue Jobs</span>
                   <span className="text-[9px] text-[#B2AAA6] italic">Input</span>
                </div>
                <div className="flex items-center justify-center py-6 bg-[#F8F4F2]/50 text-[#B2AAA6]">
                   <RefreshCcw size={20} className="animate-spin-slow opacity-40" />
                </div>
                <div className="flex items-center justify-between p-5 bg-white border-t border-[#B78D7D]/5 text-[11px] font-black text-[#3E3A39] font-mono uppercase tracking-widest">
                   <span className="flex items-center gap-3"><Activity size={14} className="text-emerald-500" /> Memory: 1.41 GB</span>
                   <span className="text-[9px] text-emerald-500 italic uppercase">Stable</span>
                </div>
              </div>
           </div>
        </div>

        <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Styled Table Sector */}
      <div className="space-y-10">
        <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none flex items-center gap-4">
           <Zap size={28} className="text-[#B78D7D]" /> Execution_Matrix
        </h2>
        <div className="overflow-hidden rounded-[3.5rem] border border-[#B78D7D]/15 bg-white shadow-xl relative group">
          <table className="w-full text-left text-sm text-[#3E3A39]">
            <thead className="bg-[#F8F4F2]/50 text-[10px] uppercase text-[#B2AAA6] tracking-[0.5em] border-b border-[#B78D7D]/10 font-mono">
              <tr>
                <th className="px-8 py-8 font-black">Test_ID</th>
                <th className="px-8 py-8 font-black">Target_Domain</th>
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
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm font-mono leading-none">
                            <CheckCircle size={14} /> Pass
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 shadow-sm font-mono leading-none">
                            <XCircle size={14} /> Fail
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
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#B78D7D]">SECURITY</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#B78D7D]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#B78D7D] font-mono">STRESS_TEST</p>
            </div>
         </div>
      </div>

    </div>
  );
}
