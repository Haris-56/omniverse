"use client";

import { 
  X, 
  Mail, 
  Activity, 
  PlayCircle, 
  PauseCircle, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  ChevronRight,
  User,
  ExternalLink,
  Send,
  CheckCircle2
} from "lucide-react";

export default function AccountDetailsModal({ account, isOpen, onClose }) {
  if (!isOpen || !account) return null;

  // Mock Campaigns Data (Enhanced)
  const campaigns = [
    { id: 1, name: "Cold Email Outreach", status: "Running", progress: 45, sent: 890, target: 2000 },
    { id: 2, name: "Newsletter Follow-up", status: "Paused", progress: 12, sent: 45, target: 400 },
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white animate-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-indigo-50/30">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${account.status === "Connected" ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-red-50 text-red-400'}`}>
              <Mail size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-gray-900 tracking-tight lowercase">{account.email}</h2>
                <ExternalLink size={14} className="text-gray-300" />
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${account.status === "Connected" ? "bg-indigo-500" : "bg-red-500"}`} />
                 <p className={`text-[10px] font-black uppercase tracking-widest ${account.status === "Connected" ? "text-indigo-600" : "text-red-500"}`}>
                   Relay: {account.status}
                 </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-10">
             {[
               { label: 'SMTP nodes', val: '02', icon: Send },
               { label: 'Units routed', val: '935', icon: BarChart3 },
               { label: 'Relay health', val: '100%', icon: CheckCircle2 },
             ].map((m, i) => (
               <div key={i} className="bg-gray-50/50 rounded-3xl p-5 border border-gray-50 hover:bg-white hover:shadow-sm transition-all">
                  <div className="text-indigo-600 mb-2 bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                     <m.icon size={16} />
                  </div>
                  <p className="text-sm font-black text-gray-900">{m.val}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.label}</p>
               </div>
             ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity size={14} className="text-indigo-600" />
              Active sequence stream monitoring
            </h3>
            <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">ROUTING</span>
          </div>

          {account.status !== "Connected" ? (
            <div className="text-center py-16 bg-red-50/30 rounded-[2rem] border border-dashed border-red-100 text-red-500">
              <ShieldCheck size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">Relay Link Severed</p>
              <p className="text-[10px] mt-1 opacity-60">Restore SMTP connection to access routing streams.</p>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="group relative bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-50 ${camp.status === 'Running' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-500'}`}>
                           {camp.status === 'Running' ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                        </div>
                        <div>
                           <p className="text-sm font-black text-gray-900 lowercase tracking-tight">{camp.name}</p>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Status: {camp.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-gray-900">{camp.sent}</p>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sent units</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">
                         <span>Stream Progress</span>
                         <span className="text-indigo-600">{camp.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                         <div 
                           className={`h-full transition-all duration-1000 ease-out rounded-full ${camp.status === 'Running' ? 'bg-indigo-600' : 'bg-amber-400'}`}
                           style={{ width: `${camp.progress}%` }}
                         />
                      </div>
                   </div>

                   <button className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all text-indigo-600 hover:opacity-70">
                      <ChevronRight size={20} />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-100 text-gray-400">
              <Zap size={40} className="mx-auto mb-4 opacity-10" />
              <p className="text-xs font-black uppercase tracking-widest">No Active Streams</p>
              <p className="text-[10px] mt-1">Initialize a new email sequence to start monitoring results.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Relay Node Ownership Verified</span>
           </div>
           <button onClick={onClose} className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm">
              Dismiss Panel
           </button>
        </div>
      </div>
    </div>
  );
}
