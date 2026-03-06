"use client";

import { useState } from "react";
import { 
  ShieldAlert, ShieldCheck, Zap, 
  Settings, Save, AlertOctagon,
  Clock, Mail, MessageSquare, Database
} from "lucide-react";

export default function SystemSettings() {
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Controls & Safety</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Define global guardrails and manage platform stability.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Save size={18} /> Save Global Config
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Security & Emergency */}
        <div className="lg:col-span-1 space-y-8">
           <div className={`p-10 rounded-[2.5rem] border ${isEmergencyStop ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'} transition-all shadow-sm`}>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[1.5rem] flex items-center justify-center mb-8">
                <AlertOctagon size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Emergency Kill-Switch</h2>
              <p className="text-slate-400 font-medium text-sm mt-2 mb-8">
                Instantly pause all automation workers, SMTP relays, and social interactions across the entire platform.
              </p>
              
              <button 
                onClick={() => setIsEmergencyStop(!isEmergencyStop)}
                className={`w-full py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                  isEmergencyStop 
                  ? 'bg-emerald-600 text-white shadow-emerald-100 ring-4 ring-emerald-50' 
                  : 'bg-red-600 text-white shadow-red-100'
                }`}
              >
                {isEmergencyStop ? 'Resume All Systems' : 'Activate Emergency Stop'}
              </button>
           </div>

           <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-400" />
                Security Rules
              </h3>
              <div className="space-y-6">
                <ToggleItem label="Enforce 2FA for Admins" active />
                <ToggleItem label="Log All DB Queries" />
                <ToggleItem label="Detect IP Spawning" active />
                <ToggleItem label="Auto-Suspend Violators" active />
              </div>
           </div>
        </div>

        {/* Right Column: Limits & Thresholds */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
               <Zap size={24} className="text-amber-500" />
               Performance Guardrails
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Global Rate Limits</h4>
                 <ControlInput label="Max Requests / Min (per User)" defaultValue="120" unit="RPM" icon={<Clock size={16}/>} />
                 <ControlInput label="Concurrent Automation Nodes" defaultValue="3" unit="Nodes" icon={<Settings size={16}/>} />
                 <ControlInput label="Max SMTP Login Failures" defaultValue="5" unit="Retries" icon={<ShieldAlert size={16}/>} />
               </div>

               <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">AI Usage Thresholds</h4>
                 <ControlInput label="Daily AI Tokens / User" defaultValue="500,000" unit="Tokens" icon={<Database size={16}/>} />
                 <ControlInput label="Max Parallel AI Closers" defaultValue="10" unit="Threads" icon={<MessageSquare size={16}/>} />
                 <ControlInput label="AI Image Generation Limit" defaultValue="50" unit="Images" icon={<Mail size={16}/>} />
               </div>
             </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Infrastructure Load Balancing</h3>
              <p className="text-slate-400 font-medium text-sm mb-8">Optimize how users are distributed across system IPs.</p>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 gap-4">
                  <div>
                    <span className="text-sm font-black text-slate-800">IP Rotation Interval</span>
                    <p className="text-xs text-slate-400 font-medium">Automatic rotation for high-volume accounts</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="number" defaultValue="24" className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-center font-bold" />
                    <span className="text-xs font-black text-slate-500 uppercase">Hours</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 gap-4">
                  <div>
                    <span className="text-sm font-black text-slate-800">Node Overload Protection</span>
                    <p className="text-xs text-slate-400 font-medium">Pause new campaigns if CPU &gt; 85%</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
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
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-slate-400">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={active} />
        <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
      </label>
    </div>
  );
}

function ControlInput({ label, defaultValue, unit, icon }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <label className="text-xs font-bold">{label}</label>
      </div>
      <div className="flex gap-2">
        <input type="text" defaultValue={defaultValue} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/20 transition-all text-sm" />
        <div className="px-3 py-3 bg-slate-100 border border-slate-100 rounded-xl flex items-center justify-center min-w-[60px]">
          <span className="text-[10px] font-black text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}
