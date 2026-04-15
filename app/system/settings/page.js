"use client";

import { useState } from "react";
import { 
  ShieldAlert, ShieldCheck, Zap, 
  Settings, Save, AlertOctagon,
  Clock, Mail, MessageSquare, Database,
  Activity, Shield, Lock, Cpu,
  Hexagon, RefreshCw
} from "lucide-react";

export default function SystemSettings() {
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-0 pb-32">
      <div className="max-w-full mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B78D7D]/10 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                 <span className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-rose-200 flex items-center gap-2">
                 <ShieldAlert size={14} className="opacity-80" />
                 Global Guardrails Active
               </span>
            </div>
            <h1 className="text-4xl font-bold text-[#3E3A39] tracking-tight uppercase leading-none">
              Safety <span className="text-rose-500">Protocol</span>
            </h1>
            <p className="text-[#8E7A70] text-base font-medium max-w-xl leading-relaxed">Manage system-wide defensive measures, emergency inhibitors, and performance thresholds.</p>
          </div>
          <button 
            className="group px-6 py-3 bg-[#B78D7D] text-white font-bold uppercase text-xs tracking-wider rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:bg-[#A37B6D] active:scale-95"
          >
            <Save size={18} className="group-hover:scale-110 transition-transform" /> 
            Save Configuration
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Security & Emergency */}
          <div className="lg:col-span-1 space-y-6">
             <div className={`p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group shadow-sm ${isEmergencyStop ? 'bg-rose-50 border-rose-300' : 'bg-white border-[#B78D7D]/15'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all duration-500 group-hover:rotate-6 ${isEmergencyStop ? 'bg-rose-500 text-white' : 'bg-[#F8F4F2] border border-[#B78D7D]/10 text-rose-500'}`}>
                  <AlertOctagon size={24} />
                </div>
                <h2 className={`text-2xl font-bold tracking-tight uppercase mb-3 leading-tight ${isEmergencyStop ? 'text-rose-600' : 'text-[#3E3A39]'}`}>Kill-Switch</h2>
                <p className="text-[#8E7A70] text-sm mt-2 mb-8 leading-relaxed">
                  Instantly terminate all neural sequence workers, SMTP relays, and interactions across the ecosystem.
                </p>
                
                <button 
                  onClick={() => setIsEmergencyStop(!isEmergencyStop)}
                  className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 border ${
                    isEmergencyStop 
                    ? 'bg-emerald-500 text-white border-white/10 shadow-md shadow-emerald-500/20' 
                    : 'bg-rose-600 text-white border-white/10 shadow-md shadow-rose-600/20'
                  }`}
                >
                  {isEmergencyStop ? 'Resume Broadcasting' : 'Trigger Nuclear Option'}
                </button>
                
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             </div>

             <div className="bg-white p-8 rounded-3xl border border-[#B78D7D]/15 relative overflow-hidden group shadow-sm">
                <h3 className="text-xl font-bold text-[#3E3A39] mb-6 flex items-center gap-3 uppercase tracking-tight">
                  <ShieldCheck size={20} className="text-[#B78D7D]" />
                  Security Directives
                </h3>
                <div className="space-y-4">
                  <ToggleItem label="Enforce Admin MFA" active />
                  <ToggleItem label="Logic Query Hashing" />
                  <ToggleItem label="IP Spawning Detection" active />
                  <ToggleItem label="Autonomous Isolation" active />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#B78D7D]/20" />
             </div>
          </div>

          {/* Right Column: Performance & Thresholds */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-8 rounded-3xl border border-[#B78D7D]/15 shadow-sm relative overflow-hidden group">
               <h3 className="text-2xl font-bold text-[#3E3A39] tracking-tight mb-8 flex items-center gap-4 uppercase leading-none">
                 <Zap size={24} className="text-[#B78D7D]" />
                 Performance Thresholds
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-6">
                    <h4 className="text-xs font-bold text-[#B2AAA6] uppercase tracking-wider border-b border-[#B78D7D]/10 pb-3 mb-2">Rate Limiters</h4>
                    <ControlInput label="Requests / Cycle" defaultValue="120" unit="U/H" icon={<Clock size={16}/>} />
                    <ControlInput label="Node Concurrency" defaultValue="3" unit="Nodes" icon={<Cpu size={16}/>} />
                    <ControlInput label="Auth Retries" defaultValue="5" unit="Retries" icon={<Lock size={16}/>} />
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-xs font-bold text-[#B2AAA6] uppercase tracking-wider border-b border-[#B78D7D]/10 pb-3 mb-2">Memory Allocation</h4>
                    <ControlInput label="Token Limit" defaultValue="500,000" unit="TKNS" icon={<Database size={16}/>} />
                    <ControlInput label="Active Threads" defaultValue="10" unit="THRDS" icon={<Activity size={16}/>} />
                    <ControlInput label="Visual Quota" defaultValue="50" unit="IMG" icon={<Mail size={16}/>} />
                 </div>
               </div>
               
               <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             </div>

             <div className="bg-white p-8 rounded-3xl border border-[#B78D7D]/15 shadow-sm relative overflow-hidden group">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#3E3A39] tracking-tight uppercase leading-tight">Infrastructure Balancing</h3>
                  <p className="text-[#8E7A70] font-bold text-xs mt-2 leading-relaxed uppercase tracking-widest">Modulate users across authorized infrastructure clusters.</p>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#F8F4F2]/50 rounded-2xl border border-[#B78D7D]/10 hover:border-[#B78D7D]/30 transition-all gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl border border-[#B78D7D]/10 text-[#B78D7D]">
                         <RefreshCw size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#3E3A39] uppercase tracking-wider leading-none">Rotation Frequency</span>
                        <p className="text-[10px] text-[#8E7A70] font-bold mt-1 uppercase tracking-wider leading-none">Autonomous node re-calibration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="number" defaultValue="24" className="w-16 p-3 bg-white border border-[#B78D7D]/20 rounded-xl text-center font-bold text-[#B78D7D] outline-none focus:border-[#B78D7D] shadow-sm" />
                      <span className="text-xs font-bold text-[#B2AAA6] uppercase tracking-wider">Hours</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#F8F4F2]/50 rounded-2xl border border-[#B78D7D]/10 hover:border-[#B78D7D]/30 transition-all gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl border border-[#B78D7D]/10 text-[#B78D7D]">
                         <Shield size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#3E3A39] uppercase tracking-wider leading-none">Overload Protection</span>
                        <p className="text-[10px] text-[#8E7A70] font-bold mt-1 uppercase tracking-wider leading-none">Throttle campaigns if CPU &gt; 85%</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-[#EBE4E0] border border-[#B78D7D]/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#B2AAA6] after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B78D7D] peer-checked:after:bg-white shadow-sm"></div>
                    </label>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleItem({ label, active }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#B78D7D]/5 last:border-0">
      <span className="text-[10px] font-bold text-[#8E7A70] uppercase tracking-wider leading-none">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={active} />
        <div className="w-10 h-5 bg-[#F8F4F2] border border-[#B78D7D]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#B2AAA6] after:border-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B78D7D] peer-checked:after:bg-white shadow-inner"></div>
      </label>
    </div>
  );
}

function ControlInput({ label, defaultValue, unit, icon, accent }) {
  return (
    <div className="space-y-2 group/input">
      <div className="flex items-center gap-3 text-[#B2AAA6] transition-colors group-hover/input:text-[#3E3A39]">
        <div className="p-1.5 rounded-md border border-[#B78D7D]/10 bg-[#F8F4F2] text-[#B78D7D] transition-all group-hover/input:border-[#B78D7D]/30">
           {icon}
        </div>
        <label className="text-xs font-bold uppercase tracking-wider leading-none">{label}</label>
      </div>
      <div className="flex gap-3">
        <input type="text" defaultValue={defaultValue} className="flex-1 px-4 py-3 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-xl font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all text-sm shadow-inner tracking-wide placeholder:text-[#B2AAA6]" />
        <div className="px-4 py-3 bg-white border border-[#B78D7D]/15 rounded-xl flex items-center justify-center min-w-[70px] shadow-sm">
          <span className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-wider leading-none">{unit}</span>
        </div>
      </div>
    </div>
  );
}
