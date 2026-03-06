"use client";

import { useState } from "react";
import { 
  Search, Calendar, Download, 
  Filter, Shield, User, 
  MapPin, CreditCard, AlertTriangle,
  Clock, ArrowRight, CheckCircle2
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
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Audit Logs</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Immutable record of all administrative actions and system events.</p>
        </div>
        <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-600">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by actor, target or details..." 
            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-medium text-slate-900 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-600 flex items-center gap-2">
            <Calendar size={18} /> Last 24h
          </button>
          <button className="flex-1 md:flex-none px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-600 flex items-center gap-2">
            <Filter size={18} /> All Events
          </button>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Activity Feed</h3>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Storage Status: Encrypted</span>
        </div>

        <div className="divide-y divide-slate-50">
          {mockLogs.map((log) => (
            <div key={log.id} className="p-8 hover:bg-slate-50/50 transition-all group flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-shrink-0">
                <LogIcon type={log.type} severity={log.severity} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{log.type.replace('_', ' ')}</span>
                  <span className="text-slate-200">•</span>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                    <Clock size={12} />
                    {log.timestamp}
                  </div>
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {log.actor} <span className="text-slate-400 font-bold italic mx-1 opacity-60">performed action on</span> {log.target}
                </h4>
                <p className="text-slate-500 font-medium text-sm mt-1">{log.details}</p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-4">
                 <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                   <ArrowRight size={20} />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-10 text-center bg-slate-50/50">
          <button className="text-sm font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest">
            Load More History
          </button>
        </div>
      </div>
    </div>
  );
}

function LogIcon({ type, severity }) {
  const getStyle = () => {
    if (severity === 'critical') return 'bg-red-100 text-red-600';
    if (severity === 'warning') return 'bg-amber-100 text-amber-600';
    return 'bg-indigo-50 text-indigo-600';
  };

  const getIcon = () => {
    if (type.includes('USER')) return <User size={20} />;
    if (type.includes('PLAN')) return <CreditCard size={20} />;
    if (type.includes('IP')) return <MapPin size={20} />;
    if (type.includes('LIMIT')) return <AlertTriangle size={20} />;
    return <Shield size={20} />;
  };

  return (
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStyle()} shadow-sm`}>
      {getIcon()}
    </div>
  );
}
