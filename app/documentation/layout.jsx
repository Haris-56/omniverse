"use client";

import Link from "next/link";
import { useState } from "react";
import { Book, CheckCircle, Boxes, ArrowRightLeft, MousePointerClick, Server, Activity, ChevronLeft, Menu, Download, Terminal } from "lucide-react";

export default function DocumentationLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const tabs = [
    { name: "Overview", href: "/documentation", icon: Book },
    { name: "Unit Testing", href: "/documentation/unit-testing", icon: CheckCircle },
    { name: "Module Testing", href: "/documentation/module-testing", icon: Boxes },
    { name: "Integration Testing", href: "/documentation/integration-testing", icon: ArrowRightLeft },
    { name: "Functional Testing", href: "/documentation/functional-testing", icon: MousePointerClick },
    { name: "System Testing", href: "/documentation/system-testing", icon: Server },
    { name: "Pseudo Codes", href: "/documentation/pseudo-codes", icon: Terminal },
  ];

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      <div className={`transition-all duration-300 border-r border-white/5 bg-[#0f0f11] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] relative z-20 overflow-hidden print:hidden ${isOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-r-0"}`}>
        <div className="min-w-[18rem] h-full flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                    <Activity size={20} />
                </div>
                <div>
                <h2 className="text-lg font-bold text-white tracking-tight">QA Hub</h2>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-md text-slate-500 hover:text-white transition-colors">
                <ChevronLeft size={20} />
            </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5 hidden-scrollbar">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-2 mt-2">Test Matrices</div>
            {tabs.map((tab) => (
                <Link key={tab.href} href={tab.href}>
                <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-left rounded-r-full"></div>
                    <tab.icon size={16} className="group-hover:text-indigo-400 transition-colors" />
                    {tab.name}
                </div>
                </Link>
            ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
                >
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  Download PDF
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative print:overflow-visible">
        
        {!isOpen && (
           <button 
             onClick={() => setIsOpen(true)}
             className="absolute top-6 left-6 z-30 p-2.5 bg-white/5 border border-white/10 rounded-xl shadow-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl animate-in fade-in print:hidden"
           >
             <Menu size={20} />
           </button>
        )}

        {!isOpen && (
          <button 
            onClick={handleDownloadPDF}
            className="absolute top-6 right-6 z-30 p-2.5 bg-indigo-500 text-white rounded-xl shadow-xl hover:bg-indigo-600 transition-all animate-in fade-in print:hidden"
            title="Download PDF"
          >
            <Download size={20} />
          </button>
        )}
        
        <div className="min-h-full backdrop-blur-3xl bg-[#0A0A0B]/95 p-10 lg:p-14 print:p-0 print:bg-white print:text-black print:backdrop-blur-none">
            <div className={`max-w-6xl mx-auto transition-all duration-300 print:mt-0 ${!isOpen ? 'mt-6' : ''}`}>
              {children}
            </div>
        </div>
      </div>
    </div>
  );
}
