import { CheckCircle, XCircle, Database, Server, Smartphone, Monitor } from "lucide-react";

export default function ModuleTestingPage() {
  const tests = [
    { id: "MT-001", component: "Email Engine", desc: "Module standalone configurations", pre: "Run queue process", expected: "Email processing completely operates", status: "Pass" },
    { id: "MT-002", component: "Instagram Logic", desc: "Headless task handling", pre: "Valid session", expected: "Functions correctly at 85% capacity limits", status: "Pass" },
    { id: "MT-003", component: "LinkedIn Login", desc: "Initial credential handling automation", pre: "Browser boot", expected: "Authenticates sessions appropriately", status: "Pass" },
    { id: "MT-004", component: "Facebook Module", desc: "Orchestrate FB sequences independently", pre: "Campaign set", expected: "Runs sequences without catastrophic crashing", status: "Fail" },
    { id: "MT-005", component: "AI Creator / Closer", desc: "Format generation with external AI APIs", pre: "System Persona data", expected: "Appropriately formats and generates prompts", status: "Fail" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8 relative">
        <div className="absolute -left-8 top-2 w-1 h-12 bg-purple-500 rounded-r-lg shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Module Testing</h1>
        <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-2xl">Domain-level validation determining functional soundness of independent engines without the entire backend context running.</p>
      </div>

      <div className="bg-gradient-to-br from-[#121214] to-[#18181b] rounded-3xl border border-white/5 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <h2 className="text-xl font-bold text-white mb-10 tracking-wide relative z-10 flex items-center gap-3">
          <Database size={24} className="text-purple-400" /> Mock Environment Architecture
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-8 relative z-10">
           {/* Mock Data Entry */}
           <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 flex flex-col items-center gap-3 w-48 shadow-lg">
             <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600">
               <Database className="text-slate-300" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Mock Data (Sinon)</span>
           </div>
           
           <div className="w-12 h-0.5 bg-dashed border-b-2 border-white/20 border-dashed"></div>

           {/* Core Execution Module */}
           <div className="p-8 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex flex-col items-center gap-4 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative">
               <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
               <Server size={32} className="text-purple-400" />
               <span className="text-sm font-bold text-purple-100 uppercase tracking-widest text-center">Engine Instance<br/><span className="text-[10px] text-purple-300/60 font-mono">(LinkedIn, Facebook)</span></span>
           </div>

           <div className="w-12 h-0.5 bg-dashed border-b-2 border-white/20 border-dashed"></div>
           
           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                 <CheckCircle size={16} className="text-emerald-400" /> <span className="text-xs font-mono text-emerald-300">expect(calls).toBe(20)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                 <CheckCircle size={16} className="text-emerald-400" /> <span className="text-xs font-mono text-emerald-300">expect(error).toBeNull()</span>
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
                <th className="px-6 py-5 font-semibold">Target Module</th>
                <th className="px-6 py-5 font-semibold">Description</th>
                <th className="px-6 py-5 font-semibold">Expected Result</th>
                <th className="px-6 py-5 font-semibold w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-purple-400 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-5">
                      <span className="font-mono text-xs text-purple-300/80 bg-purple-500/10 border border-purple-500/20 rounded px-2.5 py-1 whitespace-nowrap">{t.component}</span>
                  </td>
                  <td className="px-6 py-5 text-slate-300">{t.desc}</td>
                  <td className="px-6 py-5 text-slate-400 text-xs">{t.expected}</td>
                  <td className="px-6 py-5">
                    {t.status === "Pass" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <CheckCircle size={14} /> Pass
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
