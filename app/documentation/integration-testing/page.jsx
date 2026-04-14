import { CheckCircle, XCircle, ArrowRightLeft, Layers } from "lucide-react";

export default function IntegrationTestingPage() {
  const tests = [
    { id: "IT-001", component: "Auth Session -> DB", desc: "Verifying secure Better-Auth authentication", pre: "Login payload", expected: "Session token maps 100% accurately", status: "Pass" },
    { id: "IT-002", component: "Contacts -> DB", desc: "Bridging contact imports to module", pre: "Upload lists / CSV", expected: "Map and insert contacts robustly 100%", status: "Pass" },
    { id: "IT-003", component: "Email -> Scheduler", desc: "Integrates timers successfully to jobs", pre: "Valid node intervals", expected: "Triggers accurately without messing loops", status: "Fail" },
    { id: "IT-004", component: "IG Tasks -> Scheduler", desc: "Pushing IG tasks on automation timers", pre: "Task wait state", expected: "Integrates to system queues properly", status: "Fail" },
    { id: "IT-005", component: "Sys-Admin -> Logs", desc: "Passing SaaS execution streams safely", pre: "Workers live data", expected: "Populates current executions perfectly", status: "Fail" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8 relative">
        <div className="absolute -left-8 top-2 w-1 h-12 bg-emerald-500 rounded-r-lg shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Integration Testing</h1>
        <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-2xl">Validates perfect communication scaling between independent macro layers (Next.js to MongoDB, Node Scheduler to Redis Backend).</p>
      </div>

      <div className="bg-[#121214] rounded-3xl border border-white/5 p-8 lg:p-12 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
        <h2 className="text-xl font-bold text-white mb-10 tracking-wide relative z-10 flex items-center gap-3">
          <Layers size={24} className="text-emerald-400" /> Pipeline Bridging Blueprint
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
           <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 shadow-inner">
             <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">LAYER 1 (REQUEST)</div>
             <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-300 font-mono text-sm shadow-lg mb-3">
               Next.js Route Handlers
             </div>
             <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-300 font-mono text-sm shadow-lg">
               Background Schedulers
             </div>
           </div>

           <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-pulse cursor-default px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center gap-2">
                 Data Payload <ArrowRightLeft size={16} />
              </div>
              <div className="h-full w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mt-4"></div>
           </div>

           <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 shadow-inner">
             <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">LAYER 2 (INFRASTRUCTURE)</div>
             <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-300 font-mono text-sm shadow-lg mb-3 flex justify-between">
               <span>MongoDB Atlas Base</span>
             </div>
             <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-300 font-mono text-sm shadow-lg">
               Redis / BullMQ Queue
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Execution Matrix</h2>
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0e0e10] shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#121214] text-[10px] uppercase text-slate-500 tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-5 font-semibold">Test ID</th>
                <th className="px-6 py-5 font-semibold">Dependency Map</th>
                <th className="px-6 py-5 font-semibold">Description</th>
                <th className="px-6 py-5 font-semibold">Expected Result</th>
                <th className="px-6 py-5 font-semibold w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-emerald-400 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-5">
                      <span className="font-mono text-[10px] text-emerald-300 tracking-widest bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1 uppercase">{t.component}</span>
                  </td>
                  <td className="px-6 py-5 text-slate-300">{t.desc}</td>
                  <td className="px-6 py-5 text-slate-400 text-xs">{t.expected}</td>
                  <td className="px-6 py-5">
                    {t.status === "Pass" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
