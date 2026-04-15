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
  { id: "log_01", type: "IP_ASSIGNMENT", actor: "System Admin", target: "Alex Rivers", details: "Assigned 192.168.1.104", timestamp: "2024-02-03 14:22:15", severity: "info" },
  { id: "log_02", type: "PLAN_CHANGE", actor: "System Admin", target: "Sarah Chen", details: "Upgraded from Starter to Pro", timestamp: "2024-02-03 13:05:44", severity: "info" },
  { id: "log_03", type: "LIMIT_VIOLATION", actor: "Email Worker", target: "Mike Johnson", details: "Daily limit exceeded (52/50)", timestamp: "2024-02-03 12:44:02", severity: "warning" },
  { id: "log_04", type: "USER_SUSPENSION", actor: "Anti-Fraud Bot", target: "John Doe", details: "Multiple login attempts from restricted IP", timestamp: "2024-02-03 11:12:09", severity: "critical" },
  { id: "log_05", type: "SYSTEM_RESTART", actor: "System Monitor", target: "Infrastructure", details: "Worker node #4 restarted after high load", timestamp: "2024-02-03 09:30:00", severity: "info" },
  { id: "log_06", type: "IP_ROTATION", actor: "Scheduler", target: "Elena Rodriguez", details: "Rotated IP from 91.200.41.122 to 185.22.1.44", timestamp: "2024-02-03 08:00:15", severity: "info" },
];

export default function AuditLogs() {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-0 pb-32">
      <div className="max-w-full mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#B78D7D]/10 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                 <span className="px-5 py-2 bg-[#B78D7D]/10 text-[#B78D7D] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#B78D7D]/20 flex items-center gap-3 font-mono">
                 <Terminal size={16} className="opacity-80" />
                 Audit_Stream::Secured
               </span>
            </div>
            <h1 className="text-7xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">
              System <span className="text-[#B78D7D]">Logs</span>
            </h1>
            <p className="text-[#8E7A70] text-2xl font-medium max-w-3xl leading-relaxed italic">Immutable registry of administrative handshakes and infrastructure events.</p>
          </div>
          <button className="group px-12 py-6 bg-white text-[#3E3A39] font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] flex items-center justify-center gap-5 transition-all shadow-sm hover:bg-[#F8F4F2] active:scale-95 font-mono border border-[#B78D7D]/15">
            <Download size={24} className="group-hover:translate-y-1 transition-transform" /> 
            Export_CSV_Payload
          </button>
        </div>

        {/* Filter Matrix */}
        <div className="bg-white p-12 rounded-[4rem] border border-[#B78D7D]/15 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#B2AAA6]" size={28} />
              <input 
                type="text" 
                placeholder="Identify logs by actor, node target, or metadata..." 
                className="w-full pl-20 pr-8 py-7 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-[2.5rem] outline-none focus:border-[#B78D7D] font-bold text-[#3E3A39] transition-all shadow-sm italic placeholder:text-[#B2AAA6]"
              />
            </div>
            <div className="flex gap-6 w-full xl:w-auto">
              <button className="flex-1 xl:flex-none px-12 py-6 bg-white border border-[#B78D7D]/15 rounded-[2rem] font-black text-[11px] text-[#8E7A70] uppercase tracking-widest font-mono flex items-center gap-5 hover:border-[#B78D7D]/30 transition-all shadow-sm">
                <Calendar size={22} /> Last_24h_Cycle
              </button>
              <button className="flex-1 xl:flex-none px-12 py-6 bg-white border border-[#B78D7D]/15 rounded-[2rem] font-black text-[11px] text-[#8E7A70] uppercase tracking-widest font-mono flex items-center gap-5 hover:border-[#B78D7D]/30 transition-all shadow-sm">
                <Filter size={22} /> All_Events
              </button>
            </div>
          </div>
        </div>

        {/* Logs Chronology */}
        <div className="bg-white rounded-[4rem] overflow-hidden relative border border-[#B78D7D]/10 shadow-sm">
          <div className="p-12 border-b border-[#B78D7D]/10 bg-[#F8F4F2]/50 flex items-center justify-between">
            <div className="flex items-center gap-5">
               <Activity size={24} className="text-[#B78D7D] animate-pulse" />
               <h3 className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono">Live_Neural_Broadcasting</h3>
            </div>
            <span className="px-8 py-3 bg-white text-[#B78D7D] border border-[#B78D7D]/15 rounded-2xl text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">Status::Encrypted_Vault</span>
          </div>

          <div className="divide-y divide-[#B78D7D]/5">
            {mockLogs.map((log) => (
              <div key={log.id} className="p-12 hover:bg-[#F8F4F2]/30 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
                <div className="shrink-0">
                  <LogIcon type={log.type} severity={log.severity} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-5 mb-4">
                    <span className="text-[12px] font-black text-[#B78D7D] uppercase tracking-[0.3em] font-mono">{log.type.replace('_', ' ')}</span>
                    <span className="text-[#B2AAA6]/20 font-black">•</span>
                    <div className="flex items-center gap-4 text-[#B2AAA6] font-black text-[11px] font-mono tracking-widest uppercase">
                      <Clock size={16} className="text-[#B78D7D] opacity-60" />
                      {log.timestamp}
                    </div>
                  </div>
                  <h4 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight group-hover:text-[#B78D7D] transition-colors">
                    {log.actor} <span className="text-[#8E7A70] font-bold italic mx-3 lowercase opacity-60 tracking-normal text-2xl">executed on</span> {log.target}
                  </h4>
                  <p className="text-[#8E7A70] font-bold text-base mt-4 font-mono tracking-wide max-w-4xl border-l-2 border-[#B78D7D]/20 pl-6 leading-relaxed italic">{log.details}</p>
                </div>

                <div className="shrink-0 flex items-center gap-6 ml-auto">
                   <button className="px-8 py-4 bg-[#F8F4F2] text-[#B2AAA6] hover:text-[#B78D7D] group border border-[#B78D7D]/10 hover:border-[#B78D7D]/30 rounded-2xl transition-all active:scale-95 shadow-sm">
                     <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-16 text-center bg-[#F8F4F2]/20 border-t border-[#B78D7D]/10 relative">
            <button className="px-12 py-6 bg-white text-[#B2AAA6] hover:text-[#B78D7D] rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] font-mono transition-all border border-[#B78D7D]/15 hover:border-[#B78D7D]/40 shadow-sm">
              Load_Historical_Registry
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
    return 'bg-[#F8F4F2] text-[#B78D7D] border-[#B78D7D]/10 shadow-inner';
  };

  const getIcon = () => {
    if (type.includes('USER')) return <User size={32} />;
    if (type.includes('PLAN')) return <CreditCard size={32} />;
    if (type.includes('IP')) return <MapPin size={32} />;
    if (type.includes('LIMIT')) return <AlertTriangle size={32} />;
    return <Shield size={32} />;
  };

  return (
    <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center border shadow-sm transition-all duration-700 group-hover:rotate-6 group-hover:scale-105 ${getStyle()}`}>
      {getIcon()}
    </div>
  );
}
