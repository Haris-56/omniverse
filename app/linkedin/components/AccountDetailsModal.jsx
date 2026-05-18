"use client";

import { 
  X, 
  Linkedin, 
  Activity, 
  PlayCircle, 
  PauseCircle, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  ChevronRight,
  User,
  ExternalLink,
  Briefcase,
  Users,
  Globe,
  Hexagon
} from "lucide-react";

export default function AccountDetailsModal({ account, isOpen, onClose }) {
  if (!isOpen || !account) return null;

  // Mock Campaigns Data
  const campaigns = [
    { id: 1, name: "CEO Outreach - Tech", status: "Running", progress: 32, sent: 156, target: 500 },
    { id: 2, name: "Recruiter Connections", status: "Paused", progress: 8, sent: 34, target: 400 },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-20 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#161932]/10 backdrop-blur-[60px]" onClick={handleBackdropClick} />
      
      <div className="bg-[#FCF8FE] rounded-[4rem] shadow-[0_50px_100px_rgba(130, 69, 239,0.15)] w-full max-w-7xl h-full overflow-hidden border border-[#8245EF]/15 relative z-10 animate-in zoom-in-95 duration-500 group/modal">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all border border-gray-100 ${account.status === "Connected" ? 'bg-white text-[#8245EF]' : 'bg-rose-50 text-rose-500'}`}>
              <Linkedin size={28} fill={account.status === "Connected" ? "currentColor" : "none"} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{account.email.split('@')[0]}</h2>
                <div className="p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <ExternalLink size={14} className="text-[#8245EF]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${account.status === "Connected" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                 <p className={`text-xs font-bold ${account.status === "Connected" ? "text-emerald-600" : "text-rose-600"}`}>
                   Account Status: {account.status}
                 </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 custom-scrollbar max-h-[70vh] overflow-y-auto space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { label: 'Active Plans', val: '02', icon: Briefcase, color: 'text-[#8245EF]' },
               { label: 'People reached', val: '190+', icon: Users, color: 'text-emerald-500' },
               { label: 'System health', val: '100%', icon: ShieldCheck, color: 'text-amber-500' },
             ].map((m, i) => (
               <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#8245EF]/20 transition-all group shadow-sm">
                  <div className={`${m.color} mb-4 bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-105 transition-transform`}>
                     <m.icon size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-0.5">{m.val}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{m.label}</p>
               </div>
             ))}
          </div>

          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-3">
              <Activity size={16} className="text-[#8245EF] animate-pulse" />
              Live updates
            </h3>
            <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 uppercase tracking-wider">CONNECTED</span>
          </div>

          {account.status !== "Connected" ? (
            <div className="text-center py-16 bg-rose-50 rounded-[2.5rem] border border-dashed border-rose-200 text-rose-600 shadow-inner">
              <ShieldCheck size={48} className="mx-auto mb-6 opacity-20" />
              <p className="text-sm font-bold uppercase">Disconnected</p>
              <p className="text-xs mt-2 opacity-70 max-w-xs mx-auto">Reconnect your account to see your data again.</p>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {campaigns.map((camp) => (
                <div key={camp.id} className="group/item relative bg-white rounded-3xl border border-gray-100 p-8 hover:border-[#8245EF]/20 hover:bg-gray-50/30 transition-all duration-500 shadow-sm">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner transition-all group-hover/item:scale-105 ${camp.status === 'Running' ? 'bg-[#FCF8FE] text-[#8245EF]' : 'bg-amber-50 text-amber-500'}`}>
                           {camp.status === 'Running' ? <PlayCircle size={24} /> : <PauseCircle size={24} />}
                        </div>
                        <div>
                           <p className="text-lg font-bold text-gray-900">{camp.name}</p>
                           <p className={`text-[10px] font-bold uppercase mt-1 ${camp.status === 'Running' ? 'text-emerald-600' : 'text-amber-600'}`}>{camp.status.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                         <p className="text-3xl font-bold text-gray-900">{camp.sent}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Messages sent</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase px-1">
                         <span>Plan Progress</span>
                         <span className="text-[#8245EF]">{camp.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                         <div 
                           className={`h-full transition-all duration-1000 ease-out rounded-full ${camp.status === 'Running' ? 'bg-[#8245EF]' : 'bg-amber-500'}`}
                           style={{ width: `${camp.progress}%` }}
                         />
                      </div>
                   </div>

                   <button className="absolute top-8 right-8 text-gray-300 hover:text-[#8245EF] transition-all opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1">
                      <ExternalLink size={20} />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
              <Zap size={48} className="mx-auto mb-6 opacity-10" />
              <p className="text-sm font-bold uppercase">No active plans</p>
              <p className="text-xs mt-2 opacity-60">Start a new plan to see your progress here.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span className="text-xs font-bold text-gray-400">Your account is verified and safe</span>
           </div>
           <button onClick={onClose} className="w-full md:w-auto px-10 py-3.5 bg-[#8245EF] text-white rounded-xl text-sm font-bold transition-all hover:bg-[#6d28d9] shadow-lg active:scale-95">
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
