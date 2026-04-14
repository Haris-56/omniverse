import { CheckCircle, XCircle } from "lucide-react";

export default function UnitTestingPage() {
  const tests = [
    { id: "UT-001", component: "Database Interactions", desc: "Global database driver integrity per-module", pre: "System booted", expected: "DB operates at 100% fine natively", status: "Pass" },
    { id: "UT-002", component: "Responsive Layouts", desc: "Cross-device CSS framework constraints", pre: "Tailwind sizing", expected: "UI handles dynamic screen dimensions 100%", status: "Pass" },
    { id: "UT-003", component: "Dashboard.jsx", desc: "Static overview interface rendering", pre: "Login resolved", expected: "Dashboard components mount smoothly (static)", status: "Pass" },
    { id: "UT-004", component: "encryption.js", desc: "Test valid secure payload handling", pre: "AUTH_SECRET given", expected: "Strings encrypt successfully", status: "Pass" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8 relative group">
        <div className="absolute -left-8 top-2 w-1 h-12 bg-blue-500 rounded-r-lg shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Unit Testing</h1>
        <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-2xl">Validating isolated functions, components, and core utilities inside the internal boundaries.</p>
      </div>

      {/* Visual Diagram Element */}
      <div className="bg-[#121214] rounded-3xl border border-white/5 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <h2 className="text-xl font-bold text-white mb-10 tracking-wide relative z-10">Data Execution Flow</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 relative z-10">
           <div className="flex flex-col items-center gap-4 group">
              <div className="h-20 w-20 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 group-hover:border-blue-400 group-hover:bg-blue-500/20 transition-all shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                  <span className="font-extrabold text-xl font-mono text-blue-400">Jest</span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Test Runner</span>
           </div>
           
           <div className="h-0.5 w-12 lg:w-24 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
           
           <div className="flex flex-col gap-4">
               <div className="px-8 py-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 font-semibold shadow-xl hover:bg-indigo-500/10 transition-colors">
                  lib/ Utilities Config
               </div>
               <div className="px-8 py-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 font-semibold shadow-xl hover:bg-indigo-500/10 transition-colors">
                  UI Components Node
               </div>
           </div>
           
           <div className="h-0.5 w-12 lg:w-24 bg-gradient-to-r from-indigo-500/50 to-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
           
           <div className="flex flex-col items-center gap-4 group">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-400 group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Assertions</span>
           </div>
        </div>
      </div>

      {/* Styled Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Standard Execution Matrix</h2>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400">{tests.length} Target Scenarios</div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0e0e10] shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#121214] text-[10px] uppercase text-slate-500 tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-5 font-semibold">Test ID</th>
                <th className="px-6 py-5 font-semibold">Target Component</th>
                <th className="px-6 py-5 font-semibold">Description</th>
                <th className="px-6 py-5 font-semibold">Expected Result</th>
                <th className="px-6 py-5 font-semibold w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-blue-400 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-5">
                      <span className="font-mono text-xs text-indigo-300/80 bg-indigo-500/10 border border-indigo-500/20 rounded px-2.5 py-1">{t.component}</span>
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
