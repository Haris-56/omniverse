import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocumentationHome() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        LIVE DOCUMENTATION
      </div>
      
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight leading-tight max-w-4xl">
        Omniverse Quality Assurance & Test Matrices
      </h1>
      <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
        Welcome to the visual testing documentation hub. Select a testing tier below to view full matrices, architectural workflow diagrams, and test scenarios designed to validate the Omniverse platform securely and robustly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {[
          { title: "Unit Testing", desc: "Isolated functional testing of core utilities.", path: "/documentation/unit-testing", color: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/20", hoverLight: "group-hover:bg-blue-500" },
          { title: "Module Testing", desc: "Domain-level validation for automation engines.", path: "/documentation/module-testing", color: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/20", hoverLight: "group-hover:bg-purple-500" },
          { title: "Integration Testing", desc: "Verifying communication across boundaries.", path: "/documentation/integration-testing", color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/20", hoverLight: "group-hover:bg-emerald-500" },
          { title: "Functional Testing", desc: "E2E user journeys and logic simulation.", path: "/documentation/functional-testing", color: "from-amber-600/20 to-amber-500/5", border: "border-amber-500/20", hoverLight: "group-hover:bg-amber-500" },
          { title: "System Testing", desc: "Under-load stress and proxy evasion tests.", path: "/documentation/system-testing", color: "from-rose-600/20 to-rose-500/5", border: "border-rose-500/20", hoverLight: "group-hover:bg-rose-500" },
        ].map((item, i) => (
          <Link key={i} href={item.path}>
            <div className={`group relative p-8 rounded-3xl border ${item.border} bg-gradient-to-b ${item.color} backdrop-blur-md overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-xl h-full flex flex-col justify-between`}>
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${item.hoverLight} rounded-full -translate-y-1/2 translate-x-1/2`}></div>
              <div>
                 <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                 <p className="text-sm text-slate-300/80 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                 <span>View Matrix</span>
                 <ArrowRight size={16} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
