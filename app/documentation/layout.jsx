"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Book, CheckCircle, Boxes, 
  ArrowRightLeft, MousePointerClick, 
  Server, Activity, ChevronLeft, 
  Menu, Download, Terminal, 
  ShieldCheck, Zap, Hexagon 
} from "lucide-react";

export default function DocumentationLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const tabs = [
    { name: "Overview", href: "/documentation", icon: Book },
    { name: "Algorithm", href: "/documentation/algorithm", icon: Activity },
    { name: "External APIs", href: "/documentation/external-apis", icon: Zap },
    { name: "User Interface", href: "/documentation/user-interface", icon: MousePointerClick },
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
    <div className="flex h-screen bg-[#FCF8FE] text-[#161932] overflow-hidden font-sans relative">
      
      {/* Sidebar */}
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border-r border-[#8245EF]/15 bg-white flex flex-col shadow-[20px_0_50px_rgba(130, 69, 239,0.05)] relative z-[60] overflow-hidden print:hidden ${isOpen ? "w-[340px] opacity-100" : "w-0 opacity-0 border-r-0"}`}>
        <div className="min-w-[340px] h-full flex flex-col">
            <div className="p-10 border-b border-[#8245EF]/10 flex items-center justify-between bg-[#FCF8FE]/30">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-[#8245EF] rounded-[1.25rem] text-white shadow-lg shadow-[#8245EF]/20">
                    <ShieldCheck size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#161932] tracking-tighter uppercase leading-none">QA Hub</h2>
                  <p className="text-[9px] font-black text-[#8245EF] uppercase tracking-[0.4em] mt-2 font-mono leading-none">Verification_Matrix</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-[#FCF8FE] hover:bg-[#8245EF] group rounded-2xl text-[#94a3b8] hover:text-white transition-all border border-[#8245EF]/10">
                <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
            </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-8 flex flex-col gap-4 custom-scrollbar relative">
               <div className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.5em] mb-4 px-4 mt-4 font-mono">Test Matrices</div>
               <div className="space-y-2">
                  {tabs.map((tab) => (
                      <Link key={tab.href} href={tab.href}>
                      <div className="group flex items-center gap-5 px-6 py-4.5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#FCF8FE] text-[#64748b] hover:text-[#161932] transition-all cursor-pointer relative overflow-hidden border border-transparent font-mono">
                          <div className="absolute inset-y-0 left-0 w-1.5 bg-[#8245EF] scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r-full"></div>
                          <tab.icon size={20} className="group-hover:text-[#8245EF] transition-colors opacity-70 group-hover:opacity-100" />
                          <span>{tab.name}</span>
                      </div>
                      </Link>
                  ))}
               </div>
            </nav>

            <div className="p-10 border-t border-[#8245EF]/10">
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-4 px-8 py-5 rounded-[1.75rem] bg-[#8245EF] hover:bg-[#6d28d9] text-white text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 group border border-white/10 font-mono shadow-[#8245EF]/20"
                >
                  <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                  Compile PDF
                </button>
            </div>
        </div>
        
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto grid-background relative print:overflow-visible custom-scrollbar">
        
        {!isOpen && (
           <button 
             onClick={() => setIsOpen(true)}
             className="fixed top-10 left-10 z-[70] p-5 bg-white border border-[#8245EF]/15 rounded-[1.5rem] shadow-xl text-[#8245EF] hover:bg-[#FCF8FE] transition-all animate-in fade-in slide-in-from-left-6 print:hidden active:scale-90"
           >
             <Menu size={28} />
           </button>
        )}

        {!isOpen && (
          <button 
            onClick={handleDownloadPDF}
            className="fixed top-10 right-10 z-[70] p-5 bg-[#8245EF] text-white rounded-[1.5rem] shadow-xl hover:bg-[#6d28d9] transition-all animate-in fade-in slide-in-from-right-6 print:hidden active:scale-95 border border-white/10 shadow-[#8245EF]/20"
            title="Download PDF"
          >
            <Download size={28} />
          </button>
        )}
        
        <div className="min-h-full p-10 lg:p-24 print:p-0 print:bg-white print:text-black">
            <div className={`max-w-6xl mx-auto transition-all duration-700 print:mt-0 ${!isOpen ? 'mt-16' : ''}`}>
               {children}
            </div>
        </div>

        {/* Global Floating Background Accents */}
        <div className="fixed -top-64 -right-64 w-[800px] h-[800px] bg-[#8245EF]/[0.05] rounded-full blur-[180px] pointer-events-none z-0" />
        <div className="fixed -bottom-64 -left-64 w-[600px] h-[600px] bg-[#64748b]/[0.05] rounded-full blur-[150px] pointer-events-none z-0" />
      </div>

      {/* Platform Branding Watermark */}
      <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-0 hidden lg:block">
         <div className="flex items-center gap-6 grayscale">
            <Hexagon size={120} strokeWidth={1} className="text-[#8245EF]" />
            <h1 className="text-[10rem] font-black font-sans -ml-8 tracking-tighter text-[#8245EF]">DOCS</h1>
         </div>
      </div>
    </div>
  );
}
