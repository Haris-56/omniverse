import { CheckCircle, XCircle, MousePointerClick, ChevronRight } from "lucide-react";

export default function FunctionalTestingPage() {
  const tests = [
    { id: "FT-001", component: "Core Visual UIs", desc: "Testing all general UI/Nav logic", pre: "General browsing", expected: "UI operates flawlessly entirely across devices", status: "Pass" },
    { id: "FT-002", component: "Authorization Rules", desc: "Testing admin vs user role UI gating", pre: "Switch user roles", expected: "100% protects unauthorized paths successfully", status: "Pass" },
    { id: "FT-003", component: "Email Campaign", desc: "Full Campaign end-to-end operation", pre: "Load Visual nodes", expected: "Sends precisely following visual layout", status: "Pending" },
    { id: "FT-004", component: "LinkedIn Usage", desc: "E2E testing full LinkedIn capability workflows", pre: "Login bypassed", expected: "Executes automation nodes heavily", status: "Pending" },
    { id: "FT-005", component: "Support Pages", desc: "Help systems and tool documentation nav", pre: "Click /support", expected: "Provides loaded functional instructions", status: "Fail" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8 relative">
        <div className="absolute -left-8 top-2 w-1 h-12 bg-amber-500 rounded-r-lg shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Functional Testing</h1>
        <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-2xl">End-to-End operations ensuring complex UI combinations and features work cohesively.</p>
      </div>

      <div className="bg-gradient-to-tr from-[#141006] to-[#1a1508] rounded-3xl border border-white/5 p-8 lg:p-12 shadow-2xl overflow-hidden relative">
        <h2 className="text-xl font-bold text-white mb-8 tracking-wide relative z-10 flex items-center gap-3">
          <MousePointerClick size={24} className="text-amber-400" /> Playwright Emulation Path 
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 w-full max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="bg-black/50 p-5 rounded-2xl border border-amber-500/20 backdrop-blur text-center flex-1 w-full max-w-[200px]">
               <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold text-amber-500 mx-auto mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)]">1</div>
               <div className="text-sm font-bold text-white mb-1">Launch Config</div>
               <div className="text-[10px] text-slate-400 uppercase tracking-widest">Chrome Headless</div>
            </div>

            <ChevronRight className="text-amber-500/50 w-8 h-8 hidden md:block" />

            {/* Step 2 */}
            <div className="bg-black/50 p-5 rounded-2xl border border-amber-500/20 backdrop-blur text-center flex-1 w-full max-w-[200px]">
               <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold text-amber-500 mx-auto mb-3">2</div>
               <div className="text-sm font-bold text-white mb-1">Navigate & Click</div>
               <div className="text-[10px] text-slate-400 uppercase tracking-widest">E.g. Builder Node</div>
            </div>

            <ChevronRight className="text-amber-500/50 w-8 h-8 hidden md:block" />

            {/* Step 3 */}
            <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/40 backdrop-blur text-center flex-1 w-full max-w-[200px] shadow-[0_0_30px_rgba(245,158,11,0.15)] relative">
               <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
               <div className="w-10 h-10 rounded-full bg-amber-500 border border-amber-400 flex items-center justify-center font-bold text-black mx-auto mb-3 border-2">3</div>
               <div className="text-sm font-bold text-white mb-1">Expect(visible)</div>
               <div className="text-[10px] text-amber-200 uppercase tracking-widest">DOM Validation</div>
            </div>
        </div>
      </div>

      <div className="space-y-6 mt-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">Execution Matrix</h2>
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0e0e10] shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#121214] text-[10px] uppercase text-slate-500 tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-5 font-semibold">Test ID</th>
                <th className="px-6 py-5 font-semibold">Playwright Scope</th>
                <th className="px-6 py-5 font-semibold">Description</th>
                <th className="px-6 py-5 font-semibold">Expected DOM Impact</th>
                <th className="px-6 py-5 font-semibold w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tests.map((t, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-amber-400 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-5">
                      <span className="font-mono text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1 whitespace-nowrap">{t.component}</span>
                  </td>
                  <td className="px-6 py-5 text-slate-300">{t.desc}</td>
                  <td className="px-6 py-5 text-slate-400 text-xs">{t.expected}</td>
                  <td className="px-6 py-5">
                    {t.status === "Pass" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
