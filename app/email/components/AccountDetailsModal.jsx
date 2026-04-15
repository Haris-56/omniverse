"use client";

import { 
  X, 
  Mail, 
  Activity, 
  PlayCircle, 
  PauseCircle, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  ExternalLink,
  Send,
  Inbox,
  Hexagon,
  BarChart3
} from "lucide-react";

export default function AccountDetailsModal({ account, isOpen, onClose }) {
  if (!isOpen || !account) return null;

  // Mock Campaigns Data
  const campaigns = [
    { id: 1, name: "Cold Email Sequence A", status: "Running", progress: 54, sent: 1240, target: 2000 },
    { id: 2, name: "Follow-up Automation", status: "Paused", progress: 12, sent: 156, target: 800 },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-20 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#3E3A39]/20 backdrop-blur-[60px]" onClick={handleBackdropClick} />
      
      <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(183,141,125,0.15)] w-full max-w-7xl h-full overflow-hidden border border-[#B78D7D]/15 relative z-10 animate-in zoom-in-95 duration-500">
        
        {/* Decorative Texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Modal Header */}
        <div className="p-10 border-b border-[#B78D7D]/10 flex justify-between items-center bg-[#F8F4F2]/50 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-inner transition-all border border-[#B78D7D]/15 ${account.status === "Connected" ? 'bg-[#B78D7D] text-white' : 'bg-[#F8F4F2] text-rose-500'}`}>
              <Mail size={28} />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase">{account.email}</h2>
                <span className="px-3 py-1 bg-white border border-[#B78D7D]/10 rounded-lg text-[9px] font-black text-[#B2AAA6] font-mono tracking-widest uppercase shadow-sm">
                  SMTP_NODE
                </span>
              </div>
              <div className="flex items-center gap-3">
                 <div className={`w-2.5 h-2.5 rounded-full ${account.status === "Connected" ? "bg-emerald-500" : "bg-rose-500"} shadow-sm`} />
                 <p className={`text-[10px] font-black uppercase tracking-[0.3em] font-mono ${account.status === "Connected" ? "text-emerald-600" : "text-rose-500"}`}>
                   Node_Status:: {account.status?.toUpperCase()}
                 </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white hover:bg-[#F8F4F2] rounded-2xl transition-all border border-[#B78D7D]/10 text-[#B2AAA6] hover:text-[#B78D7D] active:scale-90 shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 md:p-14 custom-scrollbar max-h-[70vh] overflow-y-auto relative z-10 space-y-16">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { label: 'Sent Units', val: '1.24k', icon: Send, color: 'text-[#B78D7D]' },
               { label: 'Inbox Health', val: 'Active', icon: Inbox, color: 'text-emerald-500' },
               { label: 'Node Sync', val: 'Stable', icon: ShieldCheck, color: 'text-[#B78D7D]' },
             ].map((m, i) => (
               <div key={i} className="bg-[#F8F4F2]/50 rounded-[2.5rem] p-8 border border-[#B78D7D]/10 hover:border-[#B78D7D]/30 transition-all group shadow-inner">
                  <div className={`${m.color} mb-6 bg-white w-12 h-12 rounded-2xl flex items-center justify-center border border-[#B78D7D]/15 shadow-sm group-hover:rotate-12 transition-transform`}>
                     <m.icon size={22} />
                  </div>
                  <p className="text-3xl font-black text-[#3E3A39] mb-1.5 tracking-tighter leading-none">{m.val}</p>
                  <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono">{m.label}</p>
               </div>
             ))}
          </div>

          <div className="space-y-8">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] flex items-center gap-4 font-mono">
                  <Activity size={18} className="text-[#B78D7D] animate-pulse" />
                  Cluster_Broadcasting_Telemetry
                </h3>
             </div>

             {account.status !== "Connected" ? (
               <div className="text-center py-24 bg-[#F8F4F2]/30 rounded-[3.5rem] border border-dashed border-rose-500/20 text-rose-500">
                 <ShieldCheck size={56} className="mx-auto mb-8 opacity-20" />
                 <p className="text-sm font-black uppercase tracking-[0.4em] font-mono italic">Neural_Link_Severed</p>
                 <p className="text-xs mt-4 opacity-60 max-w-xs mx-auto font-bold">Re-calibrate SMTP handshake to restore automated outreach sequence.</p>
               </div>
             ) : campaigns.length > 0 ? (
               <div className="grid grid-cols-1 gap-6">
                 {campaigns.map((camp) => (
                   <div key={camp.id} className="group relative bg-white rounded-[3rem] border border-[#B78D7D]/10 p-10 hover:border-[#B78D7D]/30 hover:shadow-xl transition-all duration-700">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                         <div className="flex items-center gap-6">
                           <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center border border-[#B78D7D]/10 shadow-inner ${camp.status === 'Running' ? 'bg-[#B78D7D]/10 text-[#B78D7D]' : 'bg-[#F8F4F2] text-[#B2AAA6]'}`}>
                              {camp.status === 'Running' ? <PlayCircle size={32} /> : <PauseCircle size={32} />}
                           </div>
                           <div>
                              <p className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">{camp.name}</p>
                              <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-3 font-mono italic ${camp.status === 'Running' ? 'text-emerald-600' : 'text-amber-600'}`}>{camp.status === 'Running' ? 'ACTIVE_BROADCAST' : 'SYSTEM_PAUSE'}</p>
                           </div>
                         </div>
                         <div className="text-left md:text-right">
                            <p className="text-4xl font-black text-[#3E3A39] tracking-tighter leading-none">{camp.sent}</p>
                            <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] mt-2 font-mono italic">Units_Dispatched</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] px-2 font-mono italic">
                            <span>Saturation_Index</span>
                            <span className="text-[#B78D7D]">{camp.progress}%</span>
                         </div>
                         <div className="h-4 w-full bg-[#F8F4F2] rounded-full overflow-hidden border border-[#B78D7D]/10 p-1 shadow-inner">
                            <div 
                              className={`h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full ${camp.status === 'Running' ? 'bg-[#B78D7D] shadow-[0_0_15px_rgba(183,141,125,0.4)]' : 'bg-[#B2AAA6]'}`}
                              style={{ width: `${camp.progress}%` }}
                            />
                         </div>
                      </div>

                      <button className="absolute top-10 right-10 text-[#B2AAA6] hover:text-[#B78D7D] transition-colors active:scale-90">
                         <ExternalLink size={22} />
                      </button>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-24 bg-[#F8F4F2]/30 rounded-[3.5rem] border border-dashed border-[#B78D7D]/20 text-[#B2AAA6]">
                 <Zap size={56} className="mx-auto mb-8 opacity-20" />
                 <p className="text-sm font-black uppercase tracking-[0.4em] font-mono italic">Empty_Cluster_Registry</p>
                 <p className="text-xs mt-4 opacity-60 max-w-xs mx-auto font-bold">Initiate a new neural sequence to activate real-time telemetry tracking.</p>
               </div>
             )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-10 bg-[#F8F4F2]/50 border-t border-[#B78D7D]/10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="flex items-center gap-4">
              <ShieldCheck size={24} className="text-emerald-500" />
              <span className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono italic">Node_Identity_Verified :: Protocol_L4_Secure</span>
           </div>
           <button onClick={onClose} className="w-full md:w-auto px-12 py-5 bg-[#B78D7D] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all font-mono hover:bg-[#A37B6D] shadow-lg active:scale-95 border border-white/10">
              Deactivate_Console
           </button>
        </div>
      </div>
    </div>
  );
}
