"use client";

import { 
  X, 
  Facebook, 
  Activity, 
  PlayCircle, 
  PauseCircle, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  ChevronRight,
  User,
  ExternalLink,
  MessageSquare,
  Users,
  Globe,
  Hexagon
} from "lucide-react";

export default function AccountDetailsModal({ account, isOpen, onClose }) {
  if (!isOpen || !account) return null;

  // Mock Campaigns Data
  const campaigns = [
    { id: 1, name: "FB Group Prospecting", status: "Running", progress: 45, sent: 289, target: 1000 },
    { id: 2, name: "Direct Message Leadgen", status: "Paused", progress: 12, sent: 56, target: 500 },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-20 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#161932]/10 backdrop-blur-[60px]" onClick={handleBackdropClick} />
      
      <div className="bg-[#FCF8FE] rounded-[4rem] shadow-[0_50px_100px_rgba(130, 69, 239,0.15)] w-full max-w-7xl h-full overflow-hidden border border-[#8245EF]/15 relative z-10 animate-in zoom-in-95 duration-500 group/modal">
        
        {/* Modal Header */}
        <div className="p-10 border-b border-[#8245EF]/10 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg transition-all border border-[#8245EF]/15 ${account.status === "Connected" ? 'bg-white text-[#8245EF]' : 'bg-rose-50 text-rose-500'}`}>
              <Facebook size={36} fill={account.status === "Connected" ? "currentColor" : "none"} className="group-hover/modal:rotate-12 transition-transform duration-700" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none">{account.email.split('@')[0]}</h2>
                <div className="p-2 bg-white rounded-xl border border-[#8245EF]/10 shadow-sm">
                  <ExternalLink size={16} className="text-[#8245EF]" />
                </div>
              </div>
               <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${account.status === "Connected" ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <p className={`text-xs font-bold uppercase tracking-widest ${account.status === "Connected" ? "text-emerald-600" : "text-rose-600"}`}>
                    Status: {account.status}
                  </p>
               </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white hover:bg-[#8245EF] rounded-2xl transition-all border border-[#8245EF]/10 text-[#94a3b8] hover:text-white shadow-sm active:scale-90 group/close">
            <X size={28} className="group-hover/close:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto space-y-12">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Active Campaigns', val: '02', icon: MessageSquare, color: 'text-[#8245EF]' },
                { label: 'Total Reach', val: '410+', icon: Users, color: 'text-emerald-500' },
                { label: 'System Health', val: '100%', icon: ShieldCheck, color: 'text-amber-500' },
              ].map((m, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#8245EF]/20 transition-all group shadow-sm">
                   <div className={`${m.color} mb-6 bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 transition-transform group-hover:scale-105`}>
                      <m.icon size={24} />
                   </div>
                   <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{m.val}</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between pl-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
              <Activity size={18} className="text-[#8245EF] animate-pulse" />
              Live Updates
            </h3>
            <span className="text-[10px] font-bold px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 uppercase tracking-widest">CONNECTED</span>
          </div>

          {account.status !== "Connected" ? (
            <div className="text-center py-20 bg-rose-50 rounded-[2.5rem] border border-dashed border-rose-200 text-rose-600">
              <ShieldCheck size={56} className="mx-auto mb-6 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">Connection Lost</p>
              <p className="text-xs mt-2 font-medium max-w-xs mx-auto">Please reconnect your account to see your data again.</p>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {campaigns.map((camp) => (
                <div key={camp.id} className="group/item relative bg-white rounded-[3rem] border border-[#8245EF]/10 p-10 hover:border-[#8245EF]/30 hover:bg-[#FCF8FE]/50 transition-all duration-500 shadow-sm">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-[#8245EF]/15 shadow-inner transition-all group-hover/item:scale-110 ${camp.status === 'Running' ? 'bg-[#FCF8FE] text-[#8245EF]' : 'bg-amber-50 text-amber-500'}`}>
                           {camp.status === 'Running' ? <PlayCircle size={32} /> : <PauseCircle size={32} />}
                        </div>
                        <div>
                           <p className="text-xl font-bold text-gray-900 tracking-tight uppercase leading-none">{camp.name}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${camp.status === 'Running' ? 'text-emerald-600' : 'text-amber-600'}`}>{camp.status}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                         <p className="text-4xl font-bold text-gray-900 tracking-tight leading-none">{camp.sent}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Messages Sent</p>
                      </div>
                   </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                         <span>Campaign Progress</span>
                         <span className="text-[#8245EF]">{camp.progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                         <div 
                           className={`h-full transition-all duration-1000 ease-out rounded-full ${camp.status === 'Running' ? 'bg-[#8245EF]' : 'bg-amber-500'}`}
                           style={{ width: `${camp.progress}%` }}
                         />
                      </div>
                    </div>

                   <button className="absolute top-10 right-10 text-[#94a3b8] hover:text-[#8245EF] transition-all opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1">
                      <ExternalLink size={24} />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
              <Zap size={56} className="mx-auto mb-6 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">No Active Campaigns</p>
              <p className="text-xs mt-2 font-medium">Start a new campaign to see your progress here.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
         <div className="p-10 bg-white/60 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
               <ShieldCheck size={24} className="text-emerald-500" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Verified</span>
            </div>
            <button onClick={onClose} className="w-full md:w-auto px-12 py-5 bg-[#8245EF] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#6d28d9] shadow-lg active:scale-95">
               Close
            </button>
         </div>

        {/* Branding Decoration */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 grayscale group-hover/modal:opacity-[0.05] transition-opacity duration-1000">
           <Hexagon size={160} strokeWidth={1} className="text-[#8245EF] animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
