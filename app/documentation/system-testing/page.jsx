import { CheckCircle, XCircle, ShieldAlert, Cpu, Activity, Server, Radio, RefreshCcw } from "lucide-react";

export default function SystemTestingPage() {
  const tests = [
    { id: "ST-001", component: "Global Encryption", desc: "AES-256-GCM encryption system efficacy test", pre: "Query DB native", expected: "Security algorithms working heavily 100%", status: "Pass" },
    { id: "ST-002", component: "Proxy IP Operations", desc: "IP masking system load scaling globally", pre: "Workers binding logic", expected: "Orchestrates traffic robustly mask", status: "Fail" },
    { id: "ST-003", component: "Admin Log Aggregator", desc: "Syncs SaaS execution telemetry actively", pre: "Live tasks processing", expected: "Logs execution correctly across servers", status: "Fail" },
    { id: "ST-004", component: "Advanced AI Nodes", desc: "Scale AI Creator / AI Closer models simultaneously", pre: "Bulk triggers", expected: "Sustains operational constraints natively", status: "Fail" },
    { id: "ST-005", component: "FB Node Load", desc: "Run FB orchestration actively on system", pre: "Active campaign run", expected: "Completes heavily without engine locks", status: "Fail" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8 relative group">
        <div className="absolute -left-8 top-2 w-1 h-12 bg-rose-500 rounded-r-lg shadow-[0_0_15px_rgba(244,63,94,0.6)]"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">System & Security Testing</h1>
        <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-2xl">
          Comprehensive evaluation analyzing volumetric stress, proxy evasion stealth metrics, and encryption rigidity scaling.
        </p>
      </div>

      <div className="bg-[#121214] rounded-3xl border border-white/5 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/10 via-transparent to-transparent"></div>
        <h2 className="text-xl font-bold text-white mb-10 tracking-wide relative z-10 flex items-center gap-3">
          <Activity size={24} className="text-rose-400" /> Infrastructure Pressure Map
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
           {/* Section 1: Security & Masking */}
           <div className="bg-[#0A0A0B] border border-white/5 p-6 rounded-2xl flex flex-col gap-6 shadow-inner">
             <div className="flex items-center gap-4 text-rose-400 pb-4 border-b border-white/5">
                <ShieldAlert size={20} />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Security & Evasion</h3>
             </div>
             
             <div className="flex items-center justify-between p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 transition-colors group cursor-default shadow-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors"><Radio size={16} className="text-rose-400" /></div>
                   <span className="text-xs font-mono text-rose-200">playwright-extra</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">CreepJS Evasion</div>
             </div>
             
             <div className="flex items-center justify-between p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 transition-colors group cursor-default shadow-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors"><ShieldAlert size={16} className="text-rose-400" /></div>
                   <span className="text-xs font-mono text-rose-200">AES-256-GCM Auth</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">MongoDB Native</div>
             </div>
           </div>

           {/* Section 2: Load Simulation */}
           <div className="bg-[#0A0A0B] border border-white/5 p-6 rounded-2xl flex flex-col gap-6 shadow-inner">
             <div className="flex items-center gap-4 text-blue-400 pb-4 border-b border-white/5">
                <Cpu size={20} />
                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Load Simulation Matrix</h3>
             </div>
             
             <div className="flex flex-col gap-0">
               <div className="flex items-center justify-between p-3 rounded-t-xl bg-blue-500/10 border border-t-blue-500/20 border-x-blue-500/20 border-b-0 text-xs font-mono text-blue-300">
                  <span className="flex items-center gap-2"><Server size={14} /> 50,000 Queue Jobs</span>
                  <span className="text-[10px] tracking-widest text-slate-400 uppercase">Input</span>
               </div>
               <div className="flex items-center justify-center p-2 bg-blue-500/5 border-x border-blue-500/20 text-blue-400/50">
                  <RefreshCcw size={16} className="animate-spin duration-3000" />
               </div>
               <div className="flex items-center justify-between p-3 rounded-b-xl bg-blue-500/5 border border-b-blue-500/20 border-x-blue-500/20 border-t-0 text-xs font-mono text-blue-300">
                  <span className="flex items-center gap-2"><Activity size={14} /> Memory: 1.41 GB</span>
                  <span className="text-[10px] tracking-widest text-emerald-400 uppercase">Stable</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Styled Table */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Execution Matrix</h2>
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0e0e10] shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#121214] text-[10px] uppercase text-slate-500 tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-5 font-semibold">Test ID</th>
                <th className="px-6 py-5 font-semibold">Target Domain</th>
                <th className="px-6 py-5 font-semibold">Description</th>
                <th className="px-6 py-5 font-semibold">Expected Result</th>
                <th className="px-6 py-5 font-semibold w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-rose-400 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-5">
                      <span className="font-mono text-xs text-rose-300/80 bg-rose-500/10 border border-rose-500/20 rounded px-2.5 py-1 whitespace-nowrap">{t.component}</span>
                  </td>
                  <td className="px-6 py-5 text-slate-300 font-medium leading-relaxed">{t.desc}</td>
                  <td className="px-6 py-5 text-slate-400 text-xs leading-relaxed">{t.expected}</td>
                  <td className="px-6 py-5">
                    {t.status === "Pass" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <CheckCircle size={14} /> Pass
                        </span>
                    ) : t.status === "Fail" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                            <XCircle size={14} /> Fail
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            <span className="h-2 w-2 rounded-full bg-slate-400" /> Wait
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
