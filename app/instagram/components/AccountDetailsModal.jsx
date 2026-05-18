"use client";

import { 
  X, 
  Instagram, 
  Activity, 
  PlayCircle, 
  PauseCircle, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  ChevronRight,
  User,
  ExternalLink,
  Camera,
  Users,
  Globe
} from "lucide-react";

export default function AccountDetailsModal({ account, isOpen, onClose }) {
  if (!isOpen || !account) return null;

  // Mock Campaigns Data
  const campaigns = [
    { id: 1, name: "Luxury Brand Outreach", status: "Running", progress: 68, sent: 412, target: 800 },
    { id: 2, name: "Engagement Automation", status: "Paused", progress: 24, sent: 98, target: 400 },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl" onClick={handleBackdropClick} />
      
      <div className="bg-[#0A0A0B] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] w-full max-w-3xl overflow-hidden border border-white/10 relative z-10 animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-white/10 ${account.status === "Connected" ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
              <Instagram size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h2 className="text-2xl font-black text-white tracking-tight lowercase">@{account.email.split('@')[0]}</h2>
                <div className="p-1 px-2 rounded-md bg-white/5 border border-white/5">
                  <ExternalLink size={14} className="text-slate-500" />
                </div>
              </div>
               <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${account.status === "Connected" ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${account.status === "Connected" ? "text-emerald-400" : "text-rose-500"}`}>
                    Status: {account.status}
                  </p>
               </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 text-slate-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 custom-scrollbar max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Active Campaigns', val: '04', icon: Camera, color: 'text-rose-400' },
                { label: 'Total Reach', val: '850', icon: Users, color: 'text-emerald-400' },
                { label: 'System Health', val: '100%', icon: ShieldCheck, color: 'text-amber-400' },
              ].map((m, i) => (
                <div key={i} className="bg-white/[0.03] rounded-[2rem] p-6 border border-white/5 hover:border-white/10 transition-all group">
                   <div className={`${m.color} mb-4 bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5`}>
                      <m.icon size={20} />
                   </div>
                   <p className="text-2xl font-bold text-white mb-0.5 tracking-tight">{m.val}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
              <Activity size={16} className="text-rose-400" />
              Live Updates
            </h3>
            <span className="text-[10px] font-bold px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 uppercase tracking-widest">CONNECTED</span>
          </div>

          {account.status !== "Connected" ? (
            <div className="text-center py-20 bg-rose-500/5 rounded-[3rem] border border-dashed border-rose-500/20 text-rose-500">
              <ShieldCheck size={48} className="mx-auto mb-6 opacity-30" />
              <p className="text-sm font-bold uppercase tracking-widest">Connection Lost</p>
              <p className="text-xs mt-2 font-medium max-w-xs mx-auto text-rose-400/80">Please reconnect your account to see your data again.</p>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {campaigns.map((camp) => (
                <div key={camp.id} className="group relative bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-500">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl ${camp.status === 'Running' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-500'}`}>
                           {camp.status === 'Running' ? <PlayCircle size={28} /> : <PauseCircle size={28} />}
                        </div>
                        <div>
                           <p className="text-lg font-bold text-white tracking-tight leading-none">{camp.name}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${camp.status === 'Running' ? 'text-emerald-400' : 'text-amber-400'}`}>{camp.status}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                         <p className="text-3xl font-bold text-white tracking-tight">{camp.sent}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Total Sent</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                         <span>Campaign Progress</span>
                         <span className="text-rose-400">{camp.progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                         <div 
                           className={`h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(244,63,94,0.3)] ${camp.status === 'Running' ? 'bg-rose-500' : 'bg-amber-500'}`}
                           style={{ width: `${camp.progress}%` }}
                         />
                      </div>
                   </div>

                   <button className="absolute top-8 right-8 text-slate-600 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5 text-slate-600">
              <Zap size={48} className="mx-auto mb-6 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">No Active Campaigns</p>
              <p className="text-xs mt-2 font-medium">Start a new campaign to see your progress here.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
         <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <ShieldCheck size={20} className="text-emerald-500" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Verified</span>
            </div>
            <button onClick={onClose} className="w-full md:w-auto px-10 py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 transition-all active:scale-95">
               Close
            </button>
         </div>
      </div>
    </div>
  );
}
