"use client";

import { useState } from "react";
import { 
  Search, Calendar, Download, 
  Filter, Shield, User, 
  MapPin, CreditCard, AlertTriangle,
  Clock, ArrowRight, CheckCircle2,
  Terminal, ShieldCheck, Activity,
  Hexagon
} from "lucide-react";

const mockLogs = [
  { id: "log_01", type: "IP Assignment", actor: "System Admin", target: "Alex Rivers", details: "Assigned IP address 192.168.1.104", timestamp: "2024-02-03 14:22:15", severity: "info" },
  { id: "log_02", type: "Plan Change", actor: "System Admin", target: "Sarah Chen", details: "Upgraded user from Starter to Pro plan", timestamp: "2024-02-03 13:05:44", severity: "info" },
  { id: "log_03", type: "Limit Warning", actor: "Email Worker", target: "Mike Johnson", details: "Daily email limit exceeded (52/50)", timestamp: "2024-02-03 12:44:02", severity: "warning" },
  { id: "log_04", type: "User Suspended", actor: "Security Bot", target: "John Doe", details: "Account suspended due to multiple login failures", timestamp: "2024-02-03 11:12:09", severity: "critical" },
  { id: "log_05", type: "System Restart", actor: "Monitor", target: "Server", details: "Worker node #4 restarted automatically", timestamp: "2024-02-03 09:30:00", severity: "info" },
  { id: "log_06", type: "IP Rotation", actor: "Scheduler", target: "Elena Rodriguez", details: "Changed IP address to 185.22.1.44", timestamp: "2024-02-03 08:00:15", severity: "info" },
];

export default function AuditLogs() {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-0 pb-32">
      <div className="max-w-full mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#8245EF]/10 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <Terminal size={14} className="opacity-80" />
                 System Logs
               </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">System Activity</h1>
            <p className="text-gray-500 text-xl font-medium">A complete record of all system and admin activity.</p>
          </div>
          <button className="group px-8 py-4 bg-white text-gray-900 font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:bg-gray-50 active:scale-95 border border-gray-100">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> 
            Download CSV
          </button>
        </div>

        {/* Filter Matrix */}
        <div className="bg-white p-12 rounded-[4rem] border border-[#8245EF]/15 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input 
                type="text" 
                placeholder="Search by user, action, or date..." 
                className="w-full pl-16 pr-8 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-[#8245EF]/40 font-bold text-gray-900 transition-all shadow-sm placeholder:text-gray-300"
              />
            </div>
            <div className="flex gap-4 w-full xl:w-auto">
              <button className="flex-1 xl:flex-none px-6 py-4 bg-white border border-gray-100 rounded-xl font-bold text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-3 hover:border-gray-200 transition-all shadow-sm">
                <Calendar size={18} /> Last 24 Hours
              </button>
              <button className="flex-1 xl:flex-none px-6 py-4 bg-white border border-gray-100 rounded-xl font-bold text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-3 hover:border-gray-200 transition-all shadow-sm">
                <Filter size={18} /> All Events
              </button>
            </div>
          </div>
        </div>

        {/* Logs Chronology */}
        <div className="bg-white rounded-[4rem] overflow-hidden relative border border-[#8245EF]/10 shadow-sm">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Activity size={20} className="text-[#8245EF] animate-pulse" />
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
            </div>
            <span className="px-4 py-1.5 bg-white text-[#8245EF] border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">Active</span>
          </div>

          <div className="divide-y divide-[#8245EF]/5">
            {mockLogs.map((log) => (
              <div key={log.id} className="p-12 hover:bg-[#FCF8FE]/30 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
                <div className="shrink-0">
                  <LogIcon type={log.type} severity={log.severity} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="text-[10px] font-bold text-[#8245EF] uppercase tracking-widest">{log.type}</span>
                    <span className="text-gray-200">•</span>
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <Clock size={14} className="text-[#8245EF] opacity-60" />
                      {log.timestamp}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#8245EF] transition-colors">
                    {log.actor} <span className="text-gray-400 font-medium normal-case mx-1">acted on</span> {log.target}
                  </h4>
                  <p className="text-gray-500 font-medium text-sm mt-3 border-l-2 border-gray-100 pl-4">{log.details}</p>
                </div>

                <div className="shrink-0 flex items-center gap-6 ml-auto">
                   <button className="px-8 py-4 bg-[#FCF8FE] text-[#94a3b8] hover:text-[#8245EF] group border border-[#8245EF]/10 hover:border-[#8245EF]/30 rounded-2xl transition-all active:scale-95 shadow-sm">
                     <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-12 text-center bg-gray-50/20 border-t border-gray-100">
            <button className="px-8 py-3 bg-white text-gray-400 hover:text-[#8245EF] rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-gray-100 hover:border-gray-200 shadow-sm">
              Load More
            </button>
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LogIcon({ type, severity }) {
  const getStyle = () => {
    if (severity === 'critical') return 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm';
    if (severity === 'warning') return 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm';
    return 'bg-[#FCF8FE] text-[#8245EF] border-[#8245EF]/10 shadow-inner';
  };

  const getIcon = () => {
    if (type.includes('User')) return <User size={24} />;
    if (type.includes('Plan')) return <CreditCard size={24} />;
    if (type.includes('IP')) return <MapPin size={24} />;
    if (type.includes('Limit')) return <AlertTriangle size={24} />;
    return <Shield size={24} />;
  };

  return (
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-105 ${getStyle()}`}>
      {getIcon()}
    </div>
  );
}
